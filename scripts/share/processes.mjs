import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

export class ShareProcesses {

  children = [];
  controller = new AbortController();
  stopping = false;

  constructor() {

    this.onSignal = () => this.controller.abort(new Error('interrupted'));
    process.on('SIGINT', this.onSignal);
    process.on('SIGTERM', this.onSignal);

  }

  get signal() {
    return this.controller.signal;
  }

  start(name, command, args, env, capture = false) {

    this.signal.throwIfAborted();
    const child = spawn(command, args, {
      env,
      detached: process.platform !== 'win32',
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      windowsHide: true,
    });
    this.children.push(child);
    child.on('error', () => this.controller.abort(new Error('childHint', { cause: { name } })));
    child.on('exit', (code, signal) => {

      if (!this.stopping) {
        this.controller.abort(new Error('exitHint', { cause: { name, code: code ?? signal } }));
      }

    });
    return child;

  }

  async waitFor(predicate, timeout, errorKey) {

    const deadline = Date.now() + timeout;
    while (!await predicate()) {

      this.signal.throwIfAborted();
      if (Date.now() >= deadline) { throw new Error(errorKey); }
      await delay(250, undefined, { signal: this.signal });

    }
    this.signal.throwIfAborted();

  }

  async waitForStop() {

    this.signal.throwIfAborted();
    const stopped = new Promise((resolve) => this.signal.addEventListener('abort', resolve, { once: true }));
    await stopped;
    this.signal.throwIfAborted();

  }

  async stop() {

    this.stopping = true;
    // Each child owns a separate process group, including npm/watch descendants.
    if (process.platform === 'win32') {

      const tasks = this.children.filter((child) => child.pid).map((child) => {

        const stopped = new Promise((resolve) => {

          const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
          killer.once('exit', resolve);
          killer.once('error', resolve);

        });

        return stopped;

      });

      await Promise.all(tasks);

    } else {

      for (const child of this.children) { this.signalGroup(child, 'SIGTERM'); }
      const deadline = Date.now() + 15000;
      while (this.children.some((child) => this.groupExists(child)) && Date.now() < deadline) {
        await delay(100);
      }
      for (const child of this.children) { this.signalGroup(child, 'SIGKILL'); }

    }
    process.off('SIGINT', this.onSignal);
    process.off('SIGTERM', this.onSignal);

  }

  groupExists(child) {

    if (!child.pid) { return false; }
    try {

      process.kill(-child.pid, 0);
      return true;

    } catch { return false; }

  }

  signalGroup(child, signal) {

    if (!child.pid) { return; }
    try { process.kill(-child.pid, signal); } catch (error) {

      if (error.code !== 'ESRCH') { throw error; }

    }

  }

}

export async function assertPortAvailable(port) {

  const available = new Promise((resolve, reject) => {

    const server = createServer();
    server.once('error', () => reject(new Error('portHint', { cause: { port } })));
    server.listen(port, '127.0.0.1', () => server.close(resolve));

  });

  await available;

}

export async function waitForServer(processes, url) {

  await processes.waitFor(async () => {

    try {

      const signal = AbortSignal.any([processes.signal, AbortSignal.timeout(2000)]);
      const response = await fetch(url, { signal, redirect: 'manual' });
      await response.body?.cancel();
      return response.status >= 200 && response.status < 400;

    } catch { return false; }

  }, 120000, 'serverHint');

}
