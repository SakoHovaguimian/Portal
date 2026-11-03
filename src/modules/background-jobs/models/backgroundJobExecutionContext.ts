import type { BackgroundJobProgress } from './backgroundJobProgress';

export interface BackgroundJobExecutionContext {

  jobId: string;
  userId: string;
  attempt: number;
  signal: AbortSignal;

  reportProgress(progress: BackgroundJobProgress): void;
  wait(milliseconds: number): Promise<void>;

}
