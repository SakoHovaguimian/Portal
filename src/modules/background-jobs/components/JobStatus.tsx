import { Badge } from '@/components/ui';
import type { UiIntent } from '@/components/ui';
import { portalJobStrings as copy } from '@/strings';
import type { BackgroundJobProps } from '../models/backgroundJobProps';
import type { BackgroundJobStatus } from '../models/backgroundJobStatus';

const intents: Record<BackgroundJobStatus, UiIntent> = {
  queued: 'neutral', running: 'info', succeeded: 'success', failed: 'danger', canceled: 'warning',
};

export function JobStatus({ job }: BackgroundJobProps) {
  return <Badge dot intent={intents[job.status]}>{copy.statuses[job.status]}</Badge>;
}
