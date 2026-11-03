import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { validateInput } from '@/utils/validateInput';
import {
  EngagementKeySchema,
  type EngagementKey,
} from '../models/engagementTarget';
import {
  EngagementInputSchema,
  EngagementSummarySchema,
  type EngagementInput,
} from '../models/engagementRecord';
import {
  SavedPageSchema,
  SavedQuerySchema,
  type SavedQuery,
} from '../models/savedQuery';
export class EngagementService {
  constructor(private readonly api: ApiClientInterface) {}
  private path(key: EngagementKey) {
    const value = validateInput(EngagementKeySchema, key);
    return `/engagement/${encodeURIComponent(value.type)}/${encodeURIComponent(value.id)}`;
  }
  async get(key: EngagementKey, signal?: AbortSignal) {
    return EngagementSummarySchema.parse(
      await this.api.request(this.path(key), { signal }),
    );
  }
  async update(key: EngagementKey, input: EngagementInput) {
    return EngagementSummarySchema.parse(
      await this.api.request(this.path(key), {
        method: 'PUT',
        body: validateInput(EngagementInputSchema, input),
      }),
    );
  }
  async saved(query: SavedQuery, signal?: AbortSignal) {
    const value = validateInput(SavedQuerySchema, query);
    const params = new URLSearchParams({
      query: value.query,
      limit: String(value.limit),
      offset: String(value.offset),
    });
    return SavedPageSchema.parse(
      await this.api.request(`/engagement/saved?${params}`, { signal }),
    );
  }
  async removeSaved(key: EngagementKey) {
    await this.api.request('/engagement/saved', {
      method: 'DELETE',
      body: validateInput(EngagementKeySchema, key),
    });
  }
}
