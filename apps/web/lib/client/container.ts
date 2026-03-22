import { createServiceContainer, type AppSession, type AppearancePreference } from '@semantic-web/core';
import {
  AppearancePreferenceRepository,
  DelegatedAuthSessionRepository,
  MockDashboardRepository,
  MockFeatureRequestRepository,
  MockUserRepository,
  MockApiClient,
} from '@semantic-web/api-sdk';

const THEME_STORAGE_KEY = 'semantic-web-theme';

async function getAppearancePreference(): Promise<AppearancePreference | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AppearancePreference) : null;
}

async function setAppearancePreference(preference: AppearancePreference): Promise<void> {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preference));
  }
}

export function createBrowserServiceContainer(session: AppSession | null) {
  const apiClient = new MockApiClient();
  return createServiceContainer({
    authSessionRepository: new DelegatedAuthSessionRepository(async () => session),
    userRepository: new MockUserRepository(apiClient),
    featureRequestRepository: new MockFeatureRequestRepository(apiClient),
    dashboardRepository: new MockDashboardRepository(apiClient),
    appearancePreferenceRepository: new AppearancePreferenceRepository(
      getAppearancePreference,
      setAppearancePreference,
    ),
  });
}
