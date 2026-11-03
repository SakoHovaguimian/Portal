'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActivityIndicator, Button, DataPanel, DataTable, DirectoryFilters, DirectoryPagination, EmptyState, ErrorState, MobileRecordRow, Page, PageHeader, UiIcon } from '@/components/ui';
import { useDirectoryState } from '@/queries/useDirectoryState';
import { portalJobStrings as copy } from '@/strings';
import { useBackgroundJobs } from './hooks';
import { BackgroundJobStatusSchema } from './models/backgroundJobStatus';
import type { BackgroundJob } from './models/backgroundJob';
import { CreateJobDialog } from './components/CreateJobDialog';
import { JobStatus } from './components/JobStatus';
import { JobProgress } from './components/JobProgress';
import { formatJobDate } from './formatJobDate';

export function JobsScreen() {

  const directory = useDirectoryState();
  const status = BackgroundJobStatusSchema.safeParse(directory.status);
  const query = useBackgroundJobs({ query: directory.query.slice(0, 200), status: status.success ? status.data : undefined, offset: Math.min(directory.offset, 1000000), limit: 10 });
  const [creating, setCreating] = useState(false);
  const filtered = Boolean(directory.query || status.success);
  const statuses = BackgroundJobStatusSchema.options.map((value) => ({ value, label: copy.statuses[value] }));

  function renderHeader() {

    return (
      <PageHeader
        title={copy.title}
        eyebrow={copy.eyebrow}
        description={copy.description}
        action={<Button onClick={() => setCreating(true)}><UiIcon name="plus" />{copy.createAction}</Button>}
      />
    );

  }

  function renderFilters() {

    return (
      <DirectoryFilters
        id="jobs-search"
        value={{ query: directory.query, status: status.success ? status.data : undefined }}
        statuses={statuses}
        onChange={(value) => directory.update({ query: value.query || undefined, status: value.status, offset: undefined })}
        copy={{ search: copy.searchLabel, placeholder: copy.searchPlaceholder, clear: copy.clearAction, status: copy.statusLabel, allStatuses: copy.allStatuses }}
      />
    );

  }

  function renderJobName(job: BackgroundJob) {

    return (
      <div className="grid min-w-0 gap-1.5">
        <Link href={`/jobs/${job.id}`} className="font-medium text-primary hover:text-brand-secondary">{job.name}</Link>
        <span className="text-xs text-tertiary">{copy.attempt(job.attempt, job.maxAttempts)}</span>
      </div>
    );

  }

  function renderMobileJob(job: BackgroundJob) {

    return (
      <MobileRecordRow title={<Link href={`/jobs/${job.id}`}>{job.name}</Link>} summary={<JobStatus job={job} />} description={copy.attempt(job.attempt, job.maxAttempts)} footer={<time dateTime={job.updatedAt}>{formatJobDate(job.updatedAt)}</time>}>
        <JobProgress job={job} />
      </MobileRecordRow>
    );

  }

  function renderResults() {

    if (query.isPending) { return <div className="grid min-h-72 place-items-center p-6"><ActivityIndicator label={copy.loadingLabel} showLabel /></div>; }
    if (query.isError) { return <div className="p-4 sm:p-6"><ErrorState title={copy.unavailableTitle} description={copy.unavailableHint} onRetry={() => void query.refetch()} /></div>; }
    if (!query.data.data.length) {
      return <EmptyState variant="plain" icon="layers" title={filtered ? copy.noResultsTitle : copy.emptyTitle} description={filtered ? copy.noResultsHint : copy.emptyHint} action={!filtered ? <Button variant="secondary" onClick={() => setCreating(true)}>{copy.createAction}</Button> : undefined} />;
    }
    return (
      <DataTable
        embedded
        caption={copy.queueCaption}
        rows={query.data.data}
        getRowKey={(job) => job.id}
        getRowHref={(job) => `/jobs/${job.id}`}
        renderMobileRow={renderMobileJob}
        columns={[
          { key: 'name', header: copy.nameColumn, render: renderJobName },
          { key: 'status', header: copy.statusLabel, render: (job) => <JobStatus job={job} /> },
          { key: 'progress', header: copy.progressColumn, render: (job) => <div className="min-w-40"><JobProgress job={job} /></div> },
          { key: 'updatedAt', header: copy.updatedColumn, render: (job) => <time dateTime={job.updatedAt} className="text-sm text-tertiary">{formatJobDate(job.updatedAt)}</time> },
        ]}
      />
    );

  }

  function renderPagination() {

    if (!query.data || query.isError) { return null; }
    const { offset, limit, total } = query.data;
    return (
      <DirectoryPagination
        page={{ offset, limit, hasMore: offset + limit < total, nextOffset: offset + limit < total ? offset + limit : null }}
        count={query.data.data.length}
        busy={query.isFetching}
        label={copy.paginationLabel}
        range={(first, last) => copy.range(first, last, total)}
        onNavigate={directory.setOffset}
      />
    );

  }

  return (
    <Page>
      {renderHeader()}
      <DataPanel toolbar={renderFilters()} footer={renderPagination()} busy={query.isFetching && !query.isPending} busyLabel={copy.loadingLabel}>
        {renderResults()}
      </DataPanel>
      {creating && <CreateJobDialog onDismiss={() => setCreating(false)} onCreated={() => {

        setCreating(false);
        directory.update({ query: undefined, status: undefined, offset: undefined });

      }} />}
    </Page>
  );

}
