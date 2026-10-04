'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, staleTimes } from '@/models';
import { useServiceContainer } from '../../providers/AppProviders';

export function useDashboardOverview() {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.overview.queryKey,
    queryFn: () => container.dashboardService.getOverview(),
    staleTime: staleTimes.dashboard,
  });
}

export function useDashboardModels() {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.models.queryKey,
    queryFn: () => container.dashboardService.listModels(),
    staleTime: staleTimes.dashboard,
  });
}

export function useDashboardRecords(model = 'featureRequest', search = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.records(model, search).queryKey,
    queryFn: () =>
      container.dashboardService.listRecords({
        model,
        search,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.dashboard,
  });
}

export function useDashboardModelDetail(model: string) {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.modelDetail(model).queryKey,
    queryFn: () => container.dashboardService.getModelDetail(model),
    staleTime: staleTimes.dashboard,
  });
}
