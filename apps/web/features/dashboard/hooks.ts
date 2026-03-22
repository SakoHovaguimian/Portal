'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, staleTimes } from '@semantic-web/core';
import { useServiceContainer } from '../../providers/AppProviders';

export function useDashboardOverview() {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: () => container.services.dashboardService.getOverview(),
    staleTime: staleTimes.dashboard,
  });
}

export function useDashboardModels() {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.models,
    queryFn: () => container.services.dashboardService.listModels(),
    staleTime: staleTimes.dashboard,
  });
}

export function useDashboardRecords(model = 'featureRequest', search = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.dashboard.records(model, search),
    queryFn: () =>
      container.services.dashboardService.listRecords({
        model,
        search,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.dashboard,
  });
}
