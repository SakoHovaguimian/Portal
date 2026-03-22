import { DashboardRecordsQuerySchema, type ServiceContainer } from '@semantic-web/core';

export async function getDashboardPageData(container: ServiceContainer) {
  const [overview, models] = await Promise.all([
    container.services.dashboardService.getOverview(),
    container.services.dashboardService.listModels(),
  ]);

  return { overview, models };
}

export async function getDashboardModelDetailPageData(container: ServiceContainer, modelKey: string) {
  return container.services.dashboardService.getModelDetail(modelKey);
}

export async function getDashboardRecordsPageData(
  container: ServiceContainer,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const query = DashboardRecordsQuerySchema.parse({
    model: typeof searchParams?.model === 'string' ? searchParams.model : 'featureRequest',
    search: typeof searchParams?.search === 'string' ? searchParams.search : undefined,
    tab: typeof searchParams?.tab === 'string' ? searchParams.tab : 'overview',
    limit: 25,
    offset: 0,
  });

  return container.services.dashboardService.listRecords(query);
}
