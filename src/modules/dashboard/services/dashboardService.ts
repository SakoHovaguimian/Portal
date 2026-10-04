import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import type { DashboardRecordsQuery, PaginatedResult } from '@/models/query';
import type { DashboardRecord } from '@/models/dashboard';
import type {
  DashboardOverviewTransport,
  DashboardModelSummaryTransport,
  DashboardModelMetaTransport,
} from '@/services/api/models';
import {
  mapDashboardModelMetaTransportToDomain,
  mapDashboardModelSummaryTransportToDomain,
  mapDashboardOverviewTransportToDomain,
} from '@/services/api/domainMappers';
export class DashboardService {
  constructor(private readonly api: ApiClientInterface) {}
  async getOverview() {
    return mapDashboardOverviewTransportToDomain(
      await this.api.request<DashboardOverviewTransport>('/dashboard/overview'),
    );
  }
  async listModels() {
    return (
      await this.api.request<{ models: DashboardModelSummaryTransport[] }>(
        '/dashboard/models',
      )
    ).models.map(mapDashboardModelSummaryTransportToDomain);
  }
  async getModelDetail(model: string) {
    return mapDashboardModelMetaTransportToDomain(
      await this.api.request<DashboardModelMetaTransport>(
        `/dashboard/models/${encodeURIComponent(model)}`,
      ),
    );
  }
  async listRecords(query: DashboardRecordsQuery) {
    const params = new URLSearchParams({
      model: query.model,
      search: query.search || '',
      limit: String(query.limit),
      offset: String(query.offset),
    });
    return this.api.request<PaginatedResult<DashboardRecord>>(
      `/dashboard/records?${params}`,
    );
  }
}
