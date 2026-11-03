'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, staleTimes } from '@/models';
import { useServiceContainer } from '../../providers/AppProviders';

export function useDashboardOverview() {

  const container = useServiceContainer();
  const overviewQuery = useQuery({
    queryKey: queryKeys.dashboard.overview.queryKey,
    queryFn: () => container.dashboardService.getOverview(),
    staleTime: staleTimes.dashboard,
  });

  return overviewQuery;

}

export function useDashboardModels() {

  const container = useServiceContainer();
  const modelsQuery = useQuery({
    queryKey: queryKeys.dashboard.models.queryKey,
    queryFn: () => container.dashboardService.listModels(),
    staleTime: staleTimes.dashboard,
  });

  return modelsQuery;

}

export function useDashboardRecords(model = 'featureRequest', search = '') {

  const container = useServiceContainer();
  const recordsQuery = useQuery({
    queryKey: queryKeys.dashboard.records(model, search).queryKey,
    enabled: Boolean(model),
    queryFn: () =>
      container.dashboardService.listRecords({
        model,
        search,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.dashboard,
  });

  return recordsQuery;

}

export function useDashboardModelDetail(model: string) {

  const container = useServiceContainer();
  const modelDetailQuery = useQuery({
    queryKey: queryKeys.dashboard.modelDetail(model).queryKey,
    enabled: Boolean(model),
    queryFn: () => container.dashboardService.getModelDetail(model),
    staleTime: staleTimes.dashboard,
  });

  return modelDetailQuery;

}
