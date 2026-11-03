import type { BackgroundJob } from './backgroundJob';

export interface DemoJobQueueState {
  jobs: Map<string, BackgroundJob>;
  requests: Map<string, { fingerprint: string; jobId: string }>;
  controllers: Map<string, AbortController>;
  scheduled: boolean;
}
