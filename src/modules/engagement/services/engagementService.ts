import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { validateInput } from '@/utils/validateInput';

import {
  EngagementInputSchema,
  type EngagementInput,
} from '../models/engagementInput';
import {
  EngagementKeySchema,
  type EngagementKey,
} from '../models/engagementKey';
import {
  EngagementSummarySchema,
} from '../models/engagementSummary';
import { SavedPageSchema } from '../models/savedPage';
import {
  SavedQuerySchema,
  type SavedQuery,
} from '../models/savedQuery';

export class EngagementService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - BUILD ENGAGEMENT PATH
  // **************************************

  private buildEngagementPath(key: EngagementKey) {

    const validatedKey = validateInput(EngagementKeySchema, key);
    return `/engagement/${encodeURIComponent(validatedKey.type)}/${encodeURIComponent(validatedKey.id)}`;

  }

  // **************************************
  // MARK: - GET ENGAGEMENT SUMMARY
  // **************************************

  async get(key: EngagementKey, signal?: AbortSignal) {

    return EngagementSummarySchema.parse(
      await this.api.request(this.buildEngagementPath(key), { signal }),
    );

  }

  // **************************************
  // MARK: - UPDATE ENGAGEMENT
  // **************************************

  async update(key: EngagementKey, input: EngagementInput) {

    return EngagementSummarySchema.parse(
      await this.api.request(this.buildEngagementPath(key), {
        method: 'PUT',
        body: validateInput(EngagementInputSchema, input),
      }),
    );

  }

  // **************************************
  // MARK: - LIST SAVED ENGAGEMENT
  // **************************************

  async saved(query: SavedQuery, signal?: AbortSignal) {

    const validatedQuery = validateInput(SavedQuerySchema, query);
    const params = new URLSearchParams({
      query: validatedQuery.query,
      limit: String(validatedQuery.limit),
      offset: String(validatedQuery.offset),
    });
    return SavedPageSchema.parse(
      await this.api.request(`/engagement/saved?${params}`, { signal }),
    );

  }

  // **************************************
  // MARK: - REMOVE SAVED ENGAGEMENT
  // **************************************

  async removeSaved(key: EngagementKey) {

    await this.api.request('/engagement/saved', {
      method: 'DELETE',
      body: validateInput(EngagementKeySchema, key),
    });

  }

}
