'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServiceContainer } from '@/providers/AppProviders';
import type { BackgroundJobCreateInput, BackgroundJob } from './models/backgroundJob';
import type { BackgroundJobQuery } from './models/backgroundJobQuery';
import type { BackgroundJobRetryInput } from './models/backgroundJobRetryInput';
import { jobsQueryKeys } from './jobsQueryKeys';

export function useBackgroundJobs(query: BackgroundJobQuery) {

  const { backgroundJobService } = useServiceContainer();
  const jobs = useQuery({
    queryKey: jobsQueryKeys.list(query),
    queryFn: ({ signal }) => backgroundJobService.listJobs(query, signal),
    staleTime: 1000,
    refetchInterval: 2000,
  });

  return jobs;

}

export function useBackgroundJob(id: string) {

  const { backgroundJobService } = useServiceContainer();
  const job = useQuery({
    queryKey: jobsQueryKeys.detail(id),
    queryFn: ({ signal }) => backgroundJobService.getJob(id, signal),
    staleTime: 1000,
    refetchInterval: (query) => query.state.data && ['succeeded', 'failed', 'canceled'].includes(query.state.data.status) ? false : 1000,
  });

  return job;

}

export function useBackgroundJobMutations() {

  const { backgroundJobService } = useServiceContainer();
  const client = useQueryClient();

  function receive(job: BackgroundJob) {

    client.setQueryData(jobsQueryKeys.detail(job.id), job);
    void client.invalidateQueries({ queryKey: jobsQueryKeys.all });

  }

  const create = useMutation({ mutationFn: (input: BackgroundJobCreateInput) => backgroundJobService.createJob(input), onSuccess: receive, retry: false });
  const cancel = useMutation({ mutationFn: (id: string) => backgroundJobService.cancelJob(id), onSuccess: receive, retry: false });
  const retry = useMutation({ mutationFn: ({ id, input }: { id: string; input: BackgroundJobRetryInput }) => backgroundJobService.retryJob(id, input), onSuccess: receive, retry: false });
  return { create, cancel, retry };

}
