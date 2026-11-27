import { Badge } from '@/components/ui';
import { portalJobStrings as copy } from '@/strings';

import { formatJobDate } from '../formatJobDate';
import type { BackgroundJobProps } from '../models/backgroundJobProps';

export function JobAttemptHistory({ job }: BackgroundJobProps) {

  const attempts = job.attempts.map((attempt) => (
    <li key={attempt.number} className="grid gap-2 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-primary">{copy.attempt(attempt.number, job.maxAttempts)}</span>
        <Badge intent={attempt.status === 'failed' ? 'danger' : attempt.status === 'succeeded' ? 'success' : 'neutral'}>{copy.statuses[attempt.status]}</Badge>
      </div>
      {(attempt.finishedAt || attempt.startedAt) && <time dateTime={attempt.finishedAt ?? attempt.startedAt ?? undefined} className="text-xs text-tertiary tabular-nums">{formatJobDate(attempt.finishedAt ?? attempt.startedAt!)}</time>}
      {attempt.failure && <p className="m-0 text-sm text-secondary">{attempt.failure.message}</p>}
    </li>
  ));
  return (
    <section aria-labelledby="job-history-title" className="grid gap-4 p-(--space-panel)">
      <h2 id="job-history-title" className="m-0 text-base font-semibold text-primary">{copy.historyTitle}</h2>
      <ol className="m-0 list-none divide-y-control divide-secondary border-t-control border-secondary p-0 pt-4">{attempts}</ol>
    </section>
  );

}
