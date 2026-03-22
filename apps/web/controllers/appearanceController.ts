import type { ServiceContainer } from '@semantic-web/core';

export async function getAppearancePageData(container: ServiceContainer) {
  return container.services.themePreferenceService.getPreference();
}
