'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DomainError } from '@/errors/domainErrors';
import { createPublicEngagementService } from '@/publicClientContainer';
import { portalEngagementStrings as copy } from '@/strings';

import type { EngagementInput } from './models/engagementInput';
import type { EngagementKey } from './models/engagementKey';

export function usePublicEngagement(key: EngagementKey) {

  const service = useMemo(() => createPublicEngagementService(), []);
  const cache = useQueryClient();
  const queryKey = ['public-account-engagement', key.type, key.id] as const;
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => service.get(key, signal),
    staleTime: 0,
  });
  const mutation = useMutation({
    mutationFn: (input: EngagementInput) => service.update(key, input),
    onSuccess: (data) => cache.setQueryData(queryKey, data),
  });
  const error = mutation.error ?? query.error;
  const signedOut = error instanceof DomainError && error.status === 401;
  const updateEngagement = async (input: EngagementInput) => {

    try {

      await mutation.mutateAsync(input);
      return true;

    } catch {
      /* Inline feedback retains the previous account choices. */
      return false;
    }

  };
  const retryEngagement = () => {

    mutation.reset();
    void query.refetch();

  };
  const engagementState = {
    data: query.data,
    loading: query.isPending,
    pending: mutation.isPending,
    pendingInput: mutation.variables,
    signedOut,
    failure: error && !signedOut ? copy.errorDescription : '',
    update: updateEngagement,
    retry: retryEngagement,
  };
  return engagementState;

}
