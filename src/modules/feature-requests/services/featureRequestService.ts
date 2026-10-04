import { validateInput } from '@/utils/validateInput';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import {
  FeatureRequestMutationInputSchema,
  type FeatureRequestMutationInput,
} from '@/models/featureRequest';
import type { FeatureRequestQuery, PaginatedResult } from '@/models/query';
import type { FeatureRequestTransport } from '@/services/api/models';
import { mapFeatureRequestTransportToDomain } from '@/services/api/domainMappers';
export class FeatureRequestService {
  constructor(private readonly api: ApiClientInterface) {}
  async listFeatureRequests(query: FeatureRequestQuery) {
    const params = new URLSearchParams({
      query: query.query || '',
      limit: String(query.limit),
      offset: String(query.offset),
    });
    const page = await this.api.request<
      PaginatedResult<FeatureRequestTransport>
    >(`/feature-requests?${params}`);
    return { ...page, data: page.data.map(mapFeatureRequestTransportToDomain) };
  }
  async getFeatureRequestById(id: string) {
    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>(
        `/feature-requests/${encodeURIComponent(id)}`,
      ),
    );
  }
  async createFeatureRequest(input: FeatureRequestMutationInput) {
    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>('/feature-requests', {
        method: 'POST',
        body: validateInput(FeatureRequestMutationInputSchema, input),
      }),
    );
  }
  async updateFeatureRequest(id: string, input: FeatureRequestMutationInput) {
    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>(
        `/feature-requests/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: validateInput(FeatureRequestMutationInputSchema, input),
        },
      ),
    );
  }
  async deleteFeatureRequest(id: string) {
    await this.api.request<void>(
      `/feature-requests/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    );
  }
}
