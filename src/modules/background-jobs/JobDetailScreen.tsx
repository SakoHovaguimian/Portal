'use client';

import { useRef } from 'react';
import { ActivityIndicator, Button, Card, DescriptionList, ErrorState, Page, PageHeader, UiIcon } from '@/components/ui';
import { MutationError } from '@/components/MutationError';
import { useGuardedBack } from '@/providers/useGuardedBack';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { portalJobStrings as copy } from '@/strings';
import { useBackgroundJob, useBackgroundJobMutations } from './hooks';
import type { JobDetailScreenProps } from './models/jobDetailScreenProps';
import { JobProgress } from './components/JobProgress';
import { JobStatus } from './components/JobStatus';
import { JobAttemptHistory } from './components/JobAttemptHistory';
import { JobResult } from './components/JobResult';
import { formatJobDate } from './formatJobDate';

export function JobDetailScreen({ jobId }: JobDetailScreenProps) {

  const query = useBackgroundJob(jobId);
  const { cancel, retry } = useBackgroundJobMutations();
  const back = useGuardedBack('/jobs');
  const presentation = usePresentationService();
  const busy = useRef(false);
  const retryRequest = useRef<{ attempt: number; key: string } | null>(null);
  const job = query.data;

  async function cancelJob() {

    if (busy.current || !job) { return; }
    busy.current = true;
    try {

      const confirmed = await presentation.showAlert({ title: copy.cancelTitle, description: copy.cancelDescription, tone: 'warning', confirmLabel: copy.cancelAction, cancelLabel: copy.keepAction });
      if (confirmed) { await cancel.mutateAsync(job.id); }

    } catch {
      /* The authoritative job and inline action error remain available. */
    } finally { busy.current = false; }

  }

  async function retryJob() {

    if (busy.current || !job) { return; }
    busy.current = true;
    if (!retryRequest.current || retryRequest.current.attempt !== job.attempt) { retryRequest.current = { attempt: job.attempt, key: crypto.randomUUID() }; }
    try {
      await retry.mutateAsync({ id: job.id, input: { expectedAttempt: retryRequest.current.attempt, idempotencyKey: retryRequest.current.key } });
    } catch {
      /* Preserve the request key so an uncertain retry cannot create another attempt. */
    } finally { busy.current = false; }

  }

  function renderActions() {

    if (!job) { return null; }
    const active = job.status === 'queued' || job.status === 'running';
    const retryable = job.status === 'failed' && job.retrySafe && job.failure?.retryable && job.attempt < job.maxAttempts;
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" loading={query.isFetching} onClick={() => void query.refetch()}><UiIcon name="refresh" />{copy.refreshAction}</Button>
        {active && <Button variant="secondary" loading={cancel.isPending} disabled={cancel.isPending || retry.isPending} onClick={() => void cancelJob()}>{copy.cancelAction}</Button>}
        {retryable && <Button loading={retry.isPending} disabled={retry.isPending || cancel.isPending} onClick={() => void retryJob()}><UiIcon name="refresh" />{copy.retryAction}</Button>}
      </div>
    );

  }

  function renderProgress() {

    if (!job) { return null; }
    const hints = { queued: copy.queuedHint, running: copy.workingHint, succeeded: copy.succeededHint, failed: copy.retryHint, canceled: copy.canceledHint };
    return (
      <Card className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-semibold text-primary">{copy.progressColumn}</h2>
          <JobStatus job={job} />
        </div>
        <JobProgress job={job} />
        <p role="status" className="m-0 text-sm text-secondary">{job.status === 'failed' && (!job.retrySafe || !job.failure?.retryable || job.attempt >= job.maxAttempts) ? copy.retryUnavailableHint : hints[job.status]}</p>
        {job.failure && <div role="alert" className="rounded-control border-control border-error_subtle bg-error-primary p-4 text-sm text-error-primary">{job.failure.message}</div>}
        <MutationError error={cancel.error ?? retry.error} />
      </Card>
    );

  }

  function renderInspector() {

    if (!job) { return null; }
    return (
      <Card className="grid content-start gap-5">
        <h2 className="m-0 text-lg font-semibold text-primary">{copy.detailsTitle}</h2>
        <DescriptionList layout="rows" items={[
          { label: copy.identifierLabel, value: <span className="font-mono text-xs">{job.id}</span> },
          { label: copy.typeLabel, value: job.type === 'sample-report' ? copy.reportLabel : job.type === 'sample-export' ? copy.exportLabel : job.type },
          { label: copy.attemptLabel, value: copy.progress(job.attempt, job.maxAttempts) },
          { label: copy.createdLabel, value: <time dateTime={job.createdAt}>{formatJobDate(job.createdAt)}</time> },
          { label: copy.updatedColumn, value: <time dateTime={job.updatedAt}>{formatJobDate(job.updatedAt)}</time> },
          ...(job.finishedAt ? [{ label: copy.finishedLabel, value: <time dateTime={job.finishedAt}>{formatJobDate(job.finishedAt)}</time> }] : []),
        ]} />
      </Card>
    );

  }

  function renderBody() {

    if (query.isPending) { return <Card className="grid min-h-72 place-items-center"><ActivityIndicator label={copy.loadingLabel} showLabel /></Card>; }
    if (query.isError) { return <ErrorState title={copy.detailUnavailableTitle} description={copy.detailUnavailableHint} onRetry={() => void query.refetch()} />; }
    if (!job) { return null; }
    return (
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)]">
        <div className="grid min-w-0 gap-6">
          {renderProgress()}
          <JobResult job={job} />
          <JobAttemptHistory job={job} />
        </div>
        {renderInspector()}
      </div>
    );

  }

  return (
    <Page>
      <div><Button variant="ghost" onClick={() => void back()}><UiIcon name="chevronLeft" />{copy.backAction}</Button></div>
      <PageHeader title={job?.name ?? copy.detailsTitle} eyebrow={copy.eyebrow} action={query.isError ? undefined : renderActions()} />
      {renderBody()}
    </Page>
  );

}
