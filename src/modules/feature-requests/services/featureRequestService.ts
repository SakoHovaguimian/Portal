import {
  FeatureRequestMutationInputSchema,
  type FeatureRequestMutationInput,
} from '@/models/featureRequest';
import type { FeatureRequestQuery, PaginatedResult } from '@/models/query';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { mapFeatureRequestTransportToDomain } from '@/services/api/domainMappers';
import type { FeatureRequestTransport } from '@/services/api/models';
import { validateInput } from '@/utils/validateInput';

export class FeatureRequestService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - LIST FEATURE REQUESTS
  // **************************************

  async listFeatureRequests(query: FeatureRequestQuery, signal?: AbortSignal) {

    const parameters = new URLSearchParams({
      query: query.query || '',
      limit: String(query.limit),
      offset: String(query.offset),
    });
    const featureRequestsPage = await this.api.request<
      PaginatedResult<FeatureRequestTransport>
    >(`/feature-requests?${parameters}`, { signal });
    const featureRequests = featureRequestsPage.data.map(
      mapFeatureRequestTransportToDomain,
    );

    return { ...featureRequestsPage, data: featureRequests };

  }

  // **************************************
  // MARK: - GET FEATURE REQUEST BY ID
  // **************************************

  async getFeatureRequestById(featureRequestId: string, signal?: AbortSignal) {

    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>(
        `/feature-requests/${encodeURIComponent(featureRequestId)}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - CREATE FEATURE REQUEST
  // **************************************

  async createFeatureRequest(input: FeatureRequestMutationInput) {

    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>('/feature-requests', {
        method: 'POST',
        body: validateInput(FeatureRequestMutationInputSchema, input),
      }),
    );

  }

  // **************************************
  // MARK: - UPDATE FEATURE REQUEST
  // **************************************

  async updateFeatureRequest(
    featureRequestId: string,
    input: FeatureRequestMutationInput,
  ) {

    return mapFeatureRequestTransportToDomain(
      await this.api.request<FeatureRequestTransport>(
        `/feature-requests/${encodeURIComponent(featureRequestId)}`,
        {
          method: 'PATCH',
          body: validateInput(FeatureRequestMutationInputSchema, input),
        },
      ),
    );

  }

  // **************************************
  // MARK: - DELETE FEATURE REQUEST
  // **************************************

  async deleteFeatureRequest(featureRequestId: string) {

    await this.api.request<void>(
      `/feature-requests/${encodeURIComponent(featureRequestId)}`,
      { method: 'DELETE' },
    );

  }

}
