'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  staleTimes,
  type FeatureRequestMutationInput,
} from '@/models';
import { useServiceContainer } from '../../providers/AppProviders';

export function useFeatureRequests(query = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.featureRequests.list(query).queryKey,
    queryFn: () =>
      container.featureRequestService.listFeatureRequests({
        query,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.featureRequests,
  });
}

export function useFeatureRequest(featureRequestId: string) {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.featureRequests.detail(featureRequestId).queryKey,
    queryFn: () =>
      container.featureRequestService.getFeatureRequestById(featureRequestId),
    staleTime: staleTimes.featureRequests,
  });
}

export function useCreateFeatureRequest() {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeatureRequestMutationInput) =>
      container.featureRequestService.createFeatureRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.featureRequests._def,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview.queryKey,
      });
    },
  });
}

export function useUpdateFeatureRequest(featureRequestId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeatureRequestMutationInput) =>
      container.featureRequestService.updateFeatureRequest(
        featureRequestId,
        input,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.featureRequests.detail(featureRequestId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.featureRequests._def,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview.queryKey,
      });
    },
  });
}

export function useDeleteFeatureRequest(featureRequestId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      container.featureRequestService.deleteFeatureRequest(featureRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.featureRequests._def,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview.queryKey,
      });
    },
  });
}
