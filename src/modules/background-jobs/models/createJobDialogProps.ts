import type { BackgroundJob } from './backgroundJob';

export interface CreateJobDialogProps {

  onDismiss(): void;
  onCreated(job: BackgroundJob): void;

}
