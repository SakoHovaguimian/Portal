import type { BackgroundJob } from './backgroundJob';
import type { DemoJobRequestRecord } from './demoJobRequestRecord';

export interface DemoJobQueueState {
  jobs: Map<string, BackgroundJob>;
  requests: Map<string, DemoJobRequestRecord>;
  controllers: Map<string, AbortController>;
  scheduled: boolean;
}
