import type {
  AppearancePreferenceRepositoryInterface,
  AuthSessionRepositoryInterface,
  DashboardRepositoryInterface,
  FeatureRequestRepositoryInterface,
  UserRepositoryInterface,
} from '@semantic-web/core';
import { AccentThemeSchema, AppearancePreferenceSchema, ThemeModeSchema, type AppSession, type DashboardRecordsQuery, type FeatureRequestMutationInput, type FeatureRequestQuery, type PaginatedResult, type User, type UserMutationInput, type FeatureRequest, type DashboardModelMeta, type DashboardModelSummary, type DashboardOverview, type DashboardRecord, type AppearancePreference, type UsersQuery } from '@semantic-web/core';
import type { ApiClient } from '../client/types';
import {
  mapDashboardModelMetaTransportToDomain,
  mapDashboardModelSummaryTransportToDomain,
  mapDashboardOverviewTransportToDomain,
  mapFeatureRequestMutationToTransport,
  mapFeatureRequestTransportToDomain,
  mapUserMutationToTransport,
  mapUserTransportToDomain,
} from '../mappers/domainMappers';

export class MockUserRepository implements UserRepositoryInterface {
  constructor(private readonly apiClient: ApiClient) {}

  async listUsers(query: UsersQuery): Promise<PaginatedResult<User>> {
    const result = await this.apiClient.listUsers();
    const search = query.query?.trim().toLowerCase() ?? '';
    const filtered = result.data.filter((user) => {
      if (!search) {
        return true;
      }
      return [user.email, user.first_name, user.last_name].some((value) =>
        value.toLowerCase().includes(search),
      );
    });
    return {
      data: filtered.slice(query.offset, query.offset + query.limit).map(mapUserTransportToDomain),
      total: filtered.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async getUserById(userId: string) {
    const result = await this.apiClient.getUserById(userId);
    return result ? mapUserTransportToDomain(result) : null;
  }

  async updateUser(userId: string, input: UserMutationInput) {
    const updated = await this.apiClient.updateUser(userId, mapUserMutationToTransport(input));
    return mapUserTransportToDomain(updated);
  }
}

export class MockFeatureRequestRepository implements FeatureRequestRepositoryInterface {
  constructor(private readonly apiClient: ApiClient) {}

  async listFeatureRequests(query: FeatureRequestQuery): Promise<PaginatedResult<FeatureRequest>> {
    const result = await this.apiClient.listFeatureRequests(query.userId ?? '');
    const search = query.query?.trim().toLowerCase() ?? '';
    const filtered = result.data.filter((item) => {
      if (!search) {
        return true;
      }
      return item.message.toLowerCase().includes(search);
    });

    return {
      data: filtered.slice(query.offset, query.offset + query.limit).map(mapFeatureRequestTransportToDomain),
      total: filtered.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async getFeatureRequestById(featureRequestId: string) {
    const result = await this.apiClient.getFeatureRequestById(featureRequestId);
    return result ? mapFeatureRequestTransportToDomain(result) : null;
  }

  async createFeatureRequest(userId: string, input: FeatureRequestMutationInput) {
    const created = await this.apiClient.createFeatureRequest(userId, mapFeatureRequestMutationToTransport(input));
    return mapFeatureRequestTransportToDomain(created);
  }

  async updateFeatureRequest(featureRequestId: string, userId: string, input: FeatureRequestMutationInput) {
    const updated = await this.apiClient.updateFeatureRequest(
      featureRequestId,
      userId,
      mapFeatureRequestMutationToTransport(input),
    );
    return mapFeatureRequestTransportToDomain(updated);
  }

  async deleteFeatureRequest(featureRequestId: string, userId: string) {
    await this.apiClient.deleteFeatureRequest(featureRequestId, userId);
  }
}

export class MockDashboardRepository implements DashboardRepositoryInterface {
  constructor(private readonly apiClient: ApiClient) {}

  async getOverview(): Promise<DashboardOverview> {
    return mapDashboardOverviewTransportToDomain(await this.apiClient.getDashboardOverview());
  }

  async listModels(): Promise<DashboardModelSummary[]> {
    const result = await this.apiClient.listDashboardModels();
    return result.models.map(mapDashboardModelSummaryTransportToDomain);
  }

  async getModelDetail(modelKey: string): Promise<DashboardModelMeta | null> {
    const result = await this.apiClient.getDashboardModelDetail(modelKey);
    return result ? mapDashboardModelMetaTransportToDomain(result) : null;
  }

  async listRecords(query: DashboardRecordsQuery): Promise<PaginatedResult<DashboardRecord>> {
    const result = await this.apiClient.listDashboardRecords(query.model, query.search ?? '');
    return {
      data: result.data.slice(query.offset, query.offset + query.limit),
      total: result.total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}

export class DelegatedAuthSessionRepository implements AuthSessionRepositoryInterface {
  constructor(private readonly getter: () => Promise<AppSession | null>) {}

  async getSession() {
    return this.getter();
  }
}

export class AppearancePreferenceRepository implements AppearancePreferenceRepositoryInterface {
  constructor(
    private readonly getter: () => Promise<AppearancePreference | null>,
    private readonly setter: (preference: AppearancePreference) => Promise<void>,
  ) {}

  async getPreference(): Promise<AppearancePreference> {
    const preference = await this.getter();
    return AppearancePreferenceSchema.parse(
      preference ?? {
        mode: ThemeModeSchema.enum.light,
        accent: AccentThemeSchema.enum.aqua,
      },
    );
  }

  async savePreference(preference: AppearancePreference): Promise<AppearancePreference> {
    const parsed = AppearancePreferenceSchema.parse(preference);
    await this.setter(parsed);
    return parsed;
  }
}
