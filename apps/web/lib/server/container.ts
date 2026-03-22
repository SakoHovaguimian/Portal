import { createServiceContainer, type AppSession, type AppearancePreference } from '@semantic-web/core';
import {
  AppearancePreferenceRepository,
  DelegatedAuthSessionRepository,
  MockDashboardRepository,
  MockFeatureRequestRepository,
  MockUserRepository,
  MockApiClient,
} from '@semantic-web/api-sdk';

export function createServerServiceContainer(session: AppSession | null) {
  const apiClient = new MockApiClient();
  return createServiceContainer({
    authSessionRepository: new DelegatedAuthSessionRepository(async () => session),
    userRepository: new MockUserRepository(apiClient),
    featureRequestRepository: new MockFeatureRequestRepository(apiClient),
    dashboardRepository: new MockDashboardRepository(apiClient),
    appearancePreferenceRepository: new AppearancePreferenceRepository(
      async () => ({ mode: 'light', accent: 'aqua' } satisfies AppearancePreference),
      async () => undefined,
    ),
  });
}
