import { ProgressBar } from '@/components/ui';
import { portalJobStrings as copy } from '@/strings';

import type { BackgroundJobProps } from '../models/backgroundJobProps';

export function JobProgress({ job }: BackgroundJobProps) {

  const stage = copy.stages[job.progress.stage as keyof typeof copy.stages] ?? job.progress.stage;
  return (
    <ProgressBar
      label={stage}
      indeterminate={job.status === 'queued'}
      value={job.progress.completed}
      maxValue={job.progress.total}
      valueLabel={copy.progress(job.progress.completed, job.progress.total)}
      tone={job.status === 'failed' ? 'danger' : job.status === 'succeeded' ? 'success' : 'brand'}
      size="sm"
    />
  );

}
