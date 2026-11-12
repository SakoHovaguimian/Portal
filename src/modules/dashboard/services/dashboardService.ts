import type { DashboardRecord } from '@/models/dashboard';
import type { DashboardRecordsQuery, PaginatedResult } from '@/models/query';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import {
  mapDashboardModelMetaTransportToDomain,
  mapDashboardModelSummaryTransportToDomain,
  mapDashboardOverviewTransportToDomain,
} from '@/services/api/domainMappers';
import type {
  DashboardOverviewTransport,
  DashboardModelSummaryTransport,
  DashboardModelMetaTransport,
} from '@/services/api/models';

export class DashboardService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - GET OVERVIEW
  // **************************************

  async getOverview() {

    return mapDashboardOverviewTransportToDomain(
      await this.api.request<DashboardOverviewTransport>('/dashboard/overview'),
    );

  }

  // **************************************
  // MARK: - LIST MODELS
  // **************************************

  async listModels() {

    const modelSummaries = (
      await this.api.request<{ models: DashboardModelSummaryTransport[] }>(
        '/dashboard/models',
      )
    ).models.map(mapDashboardModelSummaryTransportToDomain);

    return modelSummaries;

  }

  // **************************************
  // MARK: - GET MODEL DETAIL
  // **************************************

  async getModelDetail(model: string) {

    return mapDashboardModelMetaTransportToDomain(
      await this.api.request<DashboardModelMetaTransport>(
        `/dashboard/models/${encodeURIComponent(model)}`,
      ),
    );

  }

  // **************************************
  // MARK: - LIST RECORDS
  // **************************************

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
