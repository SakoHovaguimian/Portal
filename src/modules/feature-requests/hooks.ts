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
  const featureRequestsQuery = useQuery({
    queryKey: queryKeys.featureRequests.list(query).queryKey,
    queryFn: ({ signal }) =>
      container.featureRequestService.listFeatureRequests(
        {
          query,
          limit: 25,
          offset: 0,
        },
        signal,
      ),
    staleTime: staleTimes.featureRequests,
  });

  return featureRequestsQuery;

}

export function useFeatureRequest(featureRequestId: string) {

  const container = useServiceContainer();
  const featureRequestQuery = useQuery({
    queryKey: queryKeys.featureRequests.detail(featureRequestId).queryKey,
    queryFn: ({ signal }) =>
      container.featureRequestService.getFeatureRequestById(
        featureRequestId,
        signal,
      ),
    staleTime: staleTimes.featureRequests,
  });

  return featureRequestQuery;

}

export function useCreateFeatureRequest() {

  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const createFeatureRequestMutation = useMutation({
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

  return createFeatureRequestMutation;

}

export function useUpdateFeatureRequest(featureRequestId: string) {

  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const updateFeatureRequestMutation = useMutation({
    mutationFn: (input: FeatureRequestMutationInput) =>
      container.featureRequestService.updateFeatureRequest(
        featureRequestId,
        input,
      ),
    onSuccess: (request) => {

      queryClient.setQueryData(
        queryKeys.featureRequests.detail(featureRequestId).queryKey,
        request,
      );
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

  return updateFeatureRequestMutation;

}

export function useDeleteFeatureRequest(featureRequestId: string) {

  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const deleteFeatureRequestMutation = useMutation({
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

  return deleteFeatureRequestMutation;

}
