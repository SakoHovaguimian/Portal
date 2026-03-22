import { ApiError } from '@semantic-web/core';
import type { ApiClient } from './types';

export type FetchApiClientOptions = {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
};

async function request<T>(
  path: string,
  init: RequestInit,
  options: FetchApiClientOptions,
): Promise<T> {
  const token = options.getToken ? await options.getToken() : null;
  const response = await fetch(`${options.baseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiError(`Request failed for ${path}`, response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function createFetchApiClient(options: FetchApiClientOptions): ApiClient {
  return {
    listUsers: () => request('/users', { method: 'GET' }, options),
    getUserById: (userId) => request(`/users/${userId}`, { method: 'GET' }, options),
    createUser: (input) => request('/users', { method: 'POST', body: JSON.stringify(input) }, options),
    updateUser: (userId, input) =>
      request(`/users/${userId}`, { method: 'PATCH', body: JSON.stringify(input) }, options),
    listFeatureRequests: () => request('/feature-requests', { method: 'GET' }, options),
    getFeatureRequestById: (featureRequestId) =>
      request(`/feature-requests/${featureRequestId}`, { method: 'GET' }, options),
    createFeatureRequest: (_userId, input) =>
      request('/feature-requests', { method: 'POST', body: JSON.stringify(input) }, options),
    updateFeatureRequest: (featureRequestId, _userId, input) =>
      request(`/feature-requests/${featureRequestId}`, { method: 'PATCH', body: JSON.stringify(input) }, options),
    deleteFeatureRequest: (featureRequestId) =>
      request(`/feature-requests/${featureRequestId}`, { method: 'DELETE' }, options),
    getDashboardOverview: () => request('/dashboard/overview', { method: 'GET' }, options),
    listDashboardModels: () => request('/dashboard/models', { method: 'GET' }, options),
    getDashboardModelDetail: (modelKey) =>
      request(`/dashboard/models/${modelKey}`, { method: 'GET' }, options),
    listDashboardRecords: (modelKey, search) =>
      request(`/dashboard/records?model=${modelKey}&search=${encodeURIComponent(search)}`, { method: 'GET' }, options),
  };
}
