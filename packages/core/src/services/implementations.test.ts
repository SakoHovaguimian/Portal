import { describe, expect, it } from 'vitest';
import { FeatureRequestService } from './implementations';
import { OwnershipError } from '../errors/domainErrors';
import type { AuthServiceInterface } from './interfaces';
import type { FeatureRequestRepositoryInterface } from '../repositories/interfaces';

const authService: AuthServiceInterface = {
  getSession: async () => ({
    user: {
      id: '11111111-1111-4111-8111-111111111111',
      externalId: 'ext-1',
      email: 'sako@example.com',
      firstName: 'Sako',
      lastName: 'Template',
      role: 'user',
    },
    token: 'token',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000).toISOString(),
  }),
  assertAuthenticated: async () => ({
    user: {
      id: '11111111-1111-4111-8111-111111111111',
      externalId: 'ext-1',
      email: 'sako@example.com',
      firstName: 'Sako',
      lastName: 'Template',
      role: 'user',
    },
    token: 'token',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000).toISOString(),
  }),
};

describe('FeatureRequestService', () => {
  it('derives list ownership from the authenticated session', async () => {
    const seenQueries: Array<{ userId?: string }> = [];
    const repository: FeatureRequestRepositoryInterface = {
      listFeatureRequests: async (query) => {
        seenQueries.push(query);
        return { data: [], total: 0, limit: query.limit, offset: query.offset };
      },
      getFeatureRequestById: async () => null,
      createFeatureRequest: async () => {
        throw new Error('not used');
      },
      updateFeatureRequest: async () => {
        throw new Error('not used');
      },
      deleteFeatureRequest: async () => undefined,
    };

    const service = new FeatureRequestService(repository, authService);
    await service.listFeatureRequests({ limit: 25, offset: 0, query: undefined });

    expect(seenQueries[0]?.userId).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('blocks updates when the feature request belongs to a different user', async () => {
    const repository: FeatureRequestRepositoryInterface = {
      listFeatureRequests: async () => ({ data: [], total: 0, limit: 25, offset: 0 }),
      getFeatureRequestById: async () => ({
        id: 'request-1',
        userId: 'someone-else',
        message: 'hello',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        user: null,
      }),
      createFeatureRequest: async () => {
        throw new Error('not used');
      },
      updateFeatureRequest: async () => {
        throw new Error('not used');
      },
      deleteFeatureRequest: async () => undefined,
    };

    const service = new FeatureRequestService(repository, authService);
    await expect(service.updateFeatureRequest('request-1', { message: 'updated' })).rejects.toBeInstanceOf(
      OwnershipError,
    );
  });
});
