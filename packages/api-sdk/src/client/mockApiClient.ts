import { NotFoundError, OwnershipError, ValidationError } from '@semantic-web/core';
import type {
  ApiClient,
  DashboardModelMetaTransport,
  FeatureRequestMutationTransport,
  FeatureRequestTransport,
  UserMutationTransport,
  UserTransport,
} from './types';
import { dashboardModelMeta, dashboardModels, dashboardOverview, featureRequests, users } from '../mocks/mockData';

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export class MockApiClient implements ApiClient {
  async listUsers() {
    await wait();
    return { data: clone(users), total: users.length, limit: 25, offset: 0 };
  }

  async getUserById(userId: string) {
    await wait();
    const user = users.find((entry) => entry.id === userId) ?? null;
    return clone(user);
  }

  async createUser(input: UserMutationTransport) {
    await wait();

    const email = input.email.trim().toLowerCase();
    if (users.some((entry) => entry.email.toLowerCase() === email)) {
      throw new ValidationError('User with this email already exists');
    }

    const created: UserTransport = {
      id: crypto.randomUUID(),
      external_id: `mock-user-${crypto.randomUUID()}`,
      first_name: input.first_name,
      last_name: input.last_name,
      email,
      phone_number: input.phone_number ?? null,
      date_of_birth: input.date_of_birth ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };

    users.unshift(created);
    return clone(created);
  }

  async updateUser(userId: string, input: UserMutationTransport) {
    await wait();
    const user = users.find((entry) => entry.id === userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    Object.assign(user, input, { updated_at: new Date().toISOString() });
    return clone(user as UserTransport);
  }

  async listFeatureRequests(userId: string) {
    await wait();
    const filtered = featureRequests.filter((entry) => entry.user_id === userId && !entry.deleted);
    return { data: clone(filtered), total: filtered.length, limit: 25, offset: 0 };
  }

  async getFeatureRequestById(featureRequestId: string) {
    await wait();
    const item = featureRequests.find((entry) => entry.id === featureRequestId && !entry.deleted) ?? null;
    return clone(item);
  }

  async createFeatureRequest(userId: string, input: FeatureRequestMutationTransport) {
    await wait();
    const user = users.find((entry) => entry.id === userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const created: FeatureRequestTransport = {
      id: crypto.randomUUID(),
      user_id: userId,
      message: input.message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
      user,
    };
    featureRequests.unshift(created);
    return clone(created);
  }

  async updateFeatureRequest(featureRequestId: string, userId: string, input: FeatureRequestMutationTransport) {
    await wait();
    const entry = featureRequests.find((item) => item.id === featureRequestId && !item.deleted);
    if (!entry) {
      throw new NotFoundError('Feature request not found');
    }
    if (entry.user_id !== userId) {
      throw new OwnershipError();
    }
    entry.message = input.message;
    entry.updated_at = new Date().toISOString();
    return clone(entry);
  }

  async deleteFeatureRequest(featureRequestId: string, userId: string) {
    await wait();
    const entry = featureRequests.find((item) => item.id === featureRequestId && !item.deleted);
    if (!entry) {
      throw new NotFoundError('Feature request not found');
    }
    if (entry.user_id !== userId) {
      throw new OwnershipError();
    }
    entry.deleted = true;
  }

  async getDashboardOverview() {
    await wait();
    return clone(dashboardOverview);
  }

  async listDashboardModels() {
    await wait();
    return { models: clone(dashboardModels) };
  }

  async getDashboardModelDetail(modelKey: string) {
    await wait();
    return clone((dashboardModelMeta[modelKey] as DashboardModelMetaTransport | undefined) ?? null);
  }

  async listDashboardRecords(modelKey: string, search: string) {
    await wait();
    const normalizedSearch = search.trim().toLowerCase();
    const source = modelKey === 'user' ? users : featureRequests;
    const data = source.filter((entry) => {
      if (!normalizedSearch) {
        return true;
      }
      return JSON.stringify(entry).toLowerCase().includes(normalizedSearch);
    });
    return { data: clone(data), total: data.length, limit: 25, offset: 0 };
  }
}
