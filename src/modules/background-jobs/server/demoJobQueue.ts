import 'server-only';
import { createHash } from 'node:crypto';

import { DomainError, NotFoundError, ValidationError } from '@/errors/domainErrors';
import { portalJobStrings as copy } from '@/strings';

import type { BackgroundJob, BackgroundJobCreateInput } from '../models/backgroundJob';
import type { BackgroundJobExecutionContext } from '../models/backgroundJobExecutionContext';
import { BackgroundJobProgressSchema } from '../models/backgroundJobProgress';
import type { BackgroundJobQuery } from '../models/backgroundJobQuery';
import { BackgroundJobResultSchema } from '../models/backgroundJobResult';
import type { BackgroundJobRetryInput } from '../models/backgroundJobRetryInput';
import type { BackgroundJobTerminalStatus } from '../models/backgroundJobTerminalStatus';
import type { DemoJobQueueState } from '../models/demoJobQueueState';
import { getBackgroundJobDefinition } from './jobDefinitionRegistry';
import { JobExecutionError } from './jobExecutionError';
import { registerSampleJobDefinitions } from './sampleJobDefinitions';

const globalQueue = globalThis as typeof globalThis & { portalDemoJobQueue?: DemoJobQueueState };
const concurrency = 2;
const maxActivePerOwner = 30;
const maxJobsPerOwner = 100;
const maxJobsOverall = 1000;

// **************************************
// MARK: - GET DEMO JOB QUEUE
// **************************************

function getDemoJobQueueState() {

  registerSampleJobDefinitions();
  globalQueue.portalDemoJobQueue ??= { jobs: new Map(), requests: new Map(), controllers: new Map(), scheduled: false };
  return globalQueue.portalDemoJobQueue;

}

// **************************************
// MARK: - READ OWNED DEMO JOB
// **************************************

export function getDemoJob(userId: string, id: string) {

  const job = getDemoJobQueueState().jobs.get(id);
  if (!job || job.userId !== userId) { throw new NotFoundError(copy.errors.unavailable); }
  return job;

}

// **************************************
// MARK: - LIST OWNED DEMO JOBS
// **************************************

export function listDemoJobs(userId: string, query: BackgroundJobQuery, empty = false) {

  const rows = empty ? [] : [...getDemoJobQueueState().jobs.values()].filter((job) => job.userId === userId && (!query.status || job.status === query.status) && `${job.name} ${job.id}`.toLocaleLowerCase('en-US').includes(query.query.toLocaleLowerCase('en-US'))).sort((firstJob, secondJob) => secondJob.createdAt.localeCompare(firstJob.createdAt));
  const offset = rows.length ? Math.min(query.offset, Math.floor((rows.length - 1) / query.limit) * query.limit) : 0;
  return { data: rows.slice(offset, offset + query.limit), total: rows.length, offset, limit: query.limit };

}

// **************************************
// MARK: - FINGERPRINT JOB REQUEST
// **************************************

function createJobRequestFingerprint(value: unknown): string {

  const stable = JSON.stringify(value, (_key, item: unknown) => {

    if (item && typeof item === 'object' && !Array.isArray(item)) {

      const entries = Object.entries(item).sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey));
      return Object.fromEntries(entries);

    }
    return item;

  });
  return createHash('sha256').update(stable).digest('hex');

}

// **************************************
// MARK: - FIND DUPLICATE JOB REQUEST
// **************************************

function findDuplicateJobRequest(userId: string, key: string, value: unknown) {

  const record = getDemoJobQueueState().requests.get(`${userId}:${key}`);
  if (!record) { return null; }
  if (record.fingerprint !== createJobRequestFingerprint(value)) { throw new DomainError(copy.errors.conflict, 'IDEMPOTENCY_CONFLICT', 409); }
  return getDemoJob(userId, record.jobId);

}

// **************************************
// MARK: - CHECK OWNER QUEUE CAPACITY
// **************************************

function checkOwnerQueueCapacity(userId: string) {

  const active = [...getDemoJobQueueState().jobs.values()].filter((job) => job.userId === userId && (job.status === 'running' || job.status === 'queued'));
  if (active.length >= maxActivePerOwner) { throw new DomainError(copy.errors.capacity, 'QUEUE_CAPACITY', 429); }

}

// **************************************
// MARK: - ENQUEUE DEMO JOB
// **************************************

export function enqueueDemoJob(userId: string, input: BackgroundJobCreateInput) {

  const previous = findDuplicateJobRequest(userId, input.idempotencyKey, { action: 'create', ...input });
  if (previous) { return previous; }
  const definition = getBackgroundJobDefinition(input.type);
  if (!definition) { throw new ValidationError(copy.errors.unknownType); }
  const payload = definition.inputSchema.safeParse(input.payload);
  if (!payload.success) { throw new ValidationError(copy.errors.invalidInput); }
  checkOwnerQueueCapacity(userId);
  const ownedJobs = [...getDemoJobQueueState().jobs.values()].filter((job) => job.userId === userId);
  if (ownedJobs.length >= maxJobsPerOwner || getDemoJobQueueState().jobs.size >= maxJobsOverall) { throw new DomainError(copy.errors.historyCapacity, 'QUEUE_CAPACITY', 429); }
  const now = new Date().toISOString();
  const job: BackgroundJob = {
    id: crypto.randomUUID(), userId, type: input.type, name: input.name, payload: input.payload,
    status: 'queued', progress: { stage: 'queued', completed: 0, total: 1 },
    attempt: 1, maxAttempts: definition.maxAttempts, retrySafe: definition.retrySafe,
    failure: null, result: null, createdAt: now, updatedAt: now, finishedAt: null,
    attempts: [{ number: 1, status: 'queued', startedAt: null, finishedAt: null, failure: null }],
  };
  getDemoJobQueueState().jobs.set(job.id, job);
  getDemoJobQueueState().requests.set(`${userId}:${input.idempotencyKey}`, { fingerprint: createJobRequestFingerprint({ action: 'create', ...input }), jobId: job.id });
  scheduleDemoQueueWork();
  return job;

}

// **************************************
// MARK: - FINISH DEMO JOB ATTEMPT
// **************************************

function finishDemoJobAttempt(job: BackgroundJob, status: BackgroundJobTerminalStatus) {

  const now = new Date().toISOString();
  job.status = status;
  job.updatedAt = now;
  job.finishedAt = now;
  job.progress.stage = status === 'succeeded' ? 'done' : status;
  const attempt = job.attempts[job.attempts.length - 1];
  attempt.status = status;
  attempt.finishedAt = now;
  attempt.failure = job.failure;

}

// **************************************
// MARK: - CANCEL DEMO JOB
// **************************************

export function cancelDemoJob(userId: string, id: string) {

  const job = getDemoJob(userId, id);
  if (job.status === 'canceled') { return job; }
  if (job.status !== 'queued' && job.status !== 'running') { throw new DomainError(copy.errors.notCancelable, 'JOB_FINISHED', 409); }
  finishDemoJobAttempt(job, 'canceled');
  getDemoJobQueueState().controllers.get(id)?.abort();
  scheduleDemoQueueWork();
  return job;

}

// **************************************
// MARK: - RETRY FAILED DEMO JOB
// **************************************

export function retryDemoJob(userId: string, id: string, input: BackgroundJobRetryInput) {

  const previous = findDuplicateJobRequest(userId, input.idempotencyKey, { action: 'retry', id, ...input });
  if (previous) { return previous; }
  const job = getDemoJob(userId, id);
  if (job.attempt !== input.expectedAttempt) { throw new DomainError(copy.errors.retryConflict, 'ATTEMPT_CONFLICT', 409); }
  const definition = getBackgroundJobDefinition(job.type);
  if (job.status !== 'failed' || !job.retrySafe || !job.failure?.retryable || job.attempt >= job.maxAttempts || !definition?.retrySafe) { throw new DomainError(copy.errors.notRetryable, 'JOB_NOT_RETRYABLE', 409); }
  checkOwnerQueueCapacity(userId);
  job.attempt += 1;
  job.status = 'queued';
  job.progress = { stage: 'queued', completed: 0, total: 1 };
  job.failure = null;
  job.result = null;
  job.finishedAt = null;
  job.updatedAt = new Date().toISOString();
  job.attempts.push({ number: job.attempt, status: 'queued', startedAt: null, finishedAt: null, failure: null });
  getDemoJobQueueState().requests.set(`${userId}:${input.idempotencyKey}`, { fingerprint: createJobRequestFingerprint({ action: 'retry', id, ...input }), jobId: id });
  scheduleDemoQueueWork();
  return job;

}

// **************************************
// MARK: - WAIT WITH COOPERATIVE CANCELLATION
// **************************************

function waitForWork(milliseconds: number, signal: AbortSignal): Promise<void> {

  const workWaitPromise = new Promise<void>((resolve, reject) => {

    signal.throwIfAborted();
    const timer = setTimeout(() => {

      signal.removeEventListener('abort', abort);
      resolve();

    }, Math.min(Math.max(milliseconds, 0), 60000));

    // **************************************
    // MARK: - ABORT PENDING WORK WAIT
    // **************************************

    function abort() {

      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      reject(signal.reason);

    }

    signal.addEventListener('abort', abort, { once: true });

  });

  return workWaitPromise;

}

// **************************************
// MARK: - EXECUTE DEMO JOB
// **************************************

async function executeDemoJob(job: BackgroundJob, queue: DemoJobQueueState, controller: AbortController) {

  // **************************************
  // MARK: - CHECK CURRENT JOB EXECUTION
  // **************************************

  const isCurrentExecution = () => queue.jobs.get(job.id) === job && queue.controllers.get(job.id) === controller && job.status === 'running' && !controller.signal.aborted;
  try {

    const definition = getBackgroundJobDefinition(job.type);
    if (!definition) { throw new JobExecutionError(copy.errors.unknownType, 'UNKNOWN_TYPE', false); }
    const context: BackgroundJobExecutionContext = {
      jobId: job.id, userId: job.userId, attempt: job.attempt, signal: controller.signal,
      reportProgress: (progress) => {

        controller.signal.throwIfAborted();
        if (!isCurrentExecution()) { return; }
        const parsed = BackgroundJobProgressSchema.safeParse(progress);
        if (!parsed.success || progress.completed / progress.total < job.progress.completed / job.progress.total) { throw new JobExecutionError(copy.errors.invalidProgress, 'INVALID_PROGRESS', false); }
        job.progress = parsed.data;
        job.updatedAt = new Date().toISOString();

      },
      wait: (milliseconds) => waitForWork(milliseconds, controller.signal),
    };
    const result = await definition.run(definition.inputSchema.parse(job.payload), context);
    if (!isCurrentExecution()) { return; }
    const parsed = BackgroundJobResultSchema.safeParse(result);
    if (!parsed.success) { throw new JobExecutionError(copy.errors.invalidResult, 'INVALID_RESULT', false); }
    job.result = parsed.data;
    job.progress.completed = job.progress.total;
    finishDemoJobAttempt(job, 'succeeded');

  } catch (error) {

    if (!isCurrentExecution()) { return; }
    job.failure = error instanceof JobExecutionError
      ? { code: error.code, message: error.message, retryable: error.retryable && job.retrySafe }
      : { code: 'WORKER_FAILURE', message: copy.errors.failed, retryable: job.retrySafe };
    finishDemoJobAttempt(job, 'failed');

  } finally {

    if (queue.controllers.get(job.id) === controller) { queue.controllers.delete(job.id); }
    scheduleDemoQueueWork();

  }

}

// **************************************
// MARK: - SCHEDULE DEMO QUEUE WORK
// **************************************

function scheduleDemoQueueWork() {

  const queue = getDemoJobQueueState();
  if (queue.scheduled) { return; }
  queue.scheduled = true;
  queueMicrotask(() => {

    queue.scheduled = false;
    for (const job of queue.jobs.values()) {

      if (queue.controllers.size >= concurrency) { break; }
      if (job.status !== 'queued') { continue; }
      const ownerRunning = [...queue.controllers.keys()].some((id) => queue.jobs.get(id)?.userId === job.userId);
      if (ownerRunning) { continue; }
      const controller = new AbortController();
      queue.controllers.set(job.id, controller);
      job.status = 'running';
      job.updatedAt = new Date().toISOString();
      const attempt = job.attempts[job.attempts.length - 1];
      attempt.status = 'running';
      attempt.startedAt = job.updatedAt;
      void executeDemoJob(job, queue, controller);

    }

  });

}

// **************************************
// MARK: - RESET DEMO BACKGROUND JOBS
// **************************************

/** Aborts waits and prevents late handler completions from restoring removed jobs. */
export function resetDemoBackgroundJobs(userId?: string) {

  const queue = getDemoJobQueueState();
  for (const [id, job] of queue.jobs) {

    if (userId && job.userId !== userId) { continue; }
    queue.controllers.get(id)?.abort();
    queue.controllers.delete(id);
    queue.jobs.delete(id);

  }
  for (const key of queue.requests.keys()) {

    if (!userId || key.startsWith(`${userId}:`)) { queue.requests.delete(key); }

  }
  scheduleDemoQueueWork();

}
