'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, staleTimes, type FeatureRequestMutationInput } from '@semantic-web/core';
import { useServiceContainer } from '../../providers/AppProviders';

export function useFeatureRequests(query = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.featureRequests.list(query),
    queryFn: () =>
      container.services.featureRequestService.listFeatureRequests({
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
    queryKey: queryKeys.featureRequests.detail(featureRequestId),
    queryFn: () => container.services.featureRequestService.getFeatureRequestById(featureRequestId),
    staleTime: staleTimes.featureRequests,
  });
}

export function useCreateFeatureRequest() {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeatureRequestMutationInput) =>
      container.services.featureRequestService.createFeatureRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.featureRequests.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useUpdateFeatureRequest(featureRequestId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeatureRequestMutationInput) =>
      container.services.featureRequestService.updateFeatureRequest(featureRequestId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.featureRequests.detail(featureRequestId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.featureRequests.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useDeleteFeatureRequest(featureRequestId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => container.services.featureRequestService.deleteFeatureRequest(featureRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.featureRequests.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}
