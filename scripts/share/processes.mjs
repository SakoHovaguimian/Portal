import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

export class ShareProcesses {

  childProcesses = [];
  cancellationController = new AbortController();
  isStopping = false;

  constructor() {

    this.handleShutdownSignal = () => this.cancellationController.abort(new Error('interrupted'));

    process.on('SIGINT', this.handleShutdownSignal);
    process.on('SIGTERM', this.handleShutdownSignal);

  }

  // **************************************
  // MARK: - GET SHUTDOWN SIGNAL
  // **************************************

  get shutdownSignal() {
    return this.cancellationController.signal;
  }

  // **************************************
  // MARK: - START PROCESS
  // **************************************

  startProcess(processName, executablePath, processArguments, processEnvironment, captureOutput = false) {

    this.shutdownSignal.throwIfAborted();

    const childProcess = spawn(executablePath, processArguments, {
      env: processEnvironment,
      detached: process.platform !== 'win32',
      stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      windowsHide: true,
    });

    this.childProcesses.push(childProcess);
    this.observeProcessLifecycle(childProcess, processName);

    return childProcess;

  }

  // **************************************
  // MARK: - OBSERVE PROCESS LIFECYCLE
  // **************************************

  observeProcessLifecycle(childProcess, processName) {

    childProcess.on('error', () => {
      this.cancellationController.abort(new Error('childHint', { cause: { name: processName } }));
    });

    childProcess.on('exit', (exitCode, exitSignal) => {

      if (!this.isStopping) {

        this.cancellationController.abort(new Error('exitHint', {
          cause: { name: processName, code: exitCode ?? exitSignal },
        }));

      }

    });

  }

  // **************************************
  // MARK: - WAIT UNTIL READY
  // **************************************

  async waitUntilReady(isReady, timeoutMilliseconds, errorKey) {

    const deadlineAt = Date.now() + timeoutMilliseconds;

    while (!await isReady()) {

      this.shutdownSignal.throwIfAborted();

      if (Date.now() >= deadlineAt) {
        throw new Error(errorKey);
      }

      await delay(250, undefined, { signal: this.shutdownSignal });

    }

    this.shutdownSignal.throwIfAborted();

  }

  // **************************************
  // MARK: - WAIT FOR SHUTDOWN
  // **************************************

  async waitForShutdown() {

    this.shutdownSignal.throwIfAborted();

    const shutdownPromise = new Promise((resolve) => {
      this.shutdownSignal.addEventListener('abort', resolve, { once: true });
    });

    await shutdownPromise;
    this.shutdownSignal.throwIfAborted();

  }

  // **************************************
  // MARK: - STOP PROCESSES
  // **************************************

  async stopProcesses() {

    this.isStopping = true;

    if (process.platform === 'win32') {
      await this.stopWindowsProcessTrees();
    } else {
      await this.stopPosixProcessGroups();
    }

    process.off('SIGINT', this.handleShutdownSignal);
    process.off('SIGTERM', this.handleShutdownSignal);

  }

  // **************************************
  // MARK: - STOP WINDOWS PROCESS TREES
  // **************************************

  async stopWindowsProcessTrees() {

    const spawnedProcesses = this.childProcesses.filter((childProcess) => childProcess.pid);
    const shutdownPromises = spawnedProcesses.map((childProcess) => this.stopWindowsProcessTree(childProcess));

    await Promise.all(shutdownPromises);

  }

  // **************************************
  // MARK: - STOP WINDOWS PROCESS TREE
  // **************************************

  stopWindowsProcessTree(childProcess) {

    const shutdownPromise = new Promise((resolve) => {

      const taskkillProcess = spawn('taskkill', ['/PID', String(childProcess.pid), '/T', '/F'], {
        stdio: 'ignore',
      });

      taskkillProcess.once('exit', resolve);
      taskkillProcess.once('error', resolve);

    });

    return shutdownPromise;

  }

  // **************************************
  // MARK: - STOP POSIX PROCESS GROUPS
  // **************************************

  async stopPosixProcessGroups() {

    // Each child owns a separate process group, including npm/watch descendants.
    for (const childProcess of this.childProcesses) {
      this.signalProcessGroup(childProcess, 'SIGTERM');
    }

    await this.waitForProcessGroupsToExit();

    for (const childProcess of this.childProcesses) {
      this.signalProcessGroup(childProcess, 'SIGKILL');
    }

  }

  // **************************************
  // MARK: - WAIT FOR PROCESS GROUPS TO EXIT
  // **************************************

  async waitForProcessGroupsToExit() {

    const deadlineAt = Date.now() + 15_000;

    while (this.hasRunningProcessGroups() && Date.now() < deadlineAt) {
      await delay(100);
    }

  }

  // **************************************
  // MARK: - CHECK RUNNING PROCESS GROUPS
  // **************************************

  hasRunningProcessGroups() {

    const hasRunningGroups = this.childProcesses.some((childProcess) => this.isProcessGroupRunning(childProcess));
    return hasRunningGroups;

  }

  // **************************************
  // MARK: - CHECK PROCESS GROUP RUNNING
  // **************************************

  isProcessGroupRunning(childProcess) {

    if (!childProcess.pid) {
      return false;
    }

    try {

      process.kill(-childProcess.pid, 0);
      return true;

    } catch {
      return false;
    }

  }

  // **************************************
  // MARK: - SIGNAL PROCESS GROUP
  // **************************************

  signalProcessGroup(childProcess, shutdownSignal) {

    if (!childProcess.pid) {
      return;
    }

    try {
      process.kill(-childProcess.pid, shutdownSignal);
    } catch (signalError) {

      if (signalError.code !== 'ESRCH') {
        throw signalError;
      }

    }

  }

}
