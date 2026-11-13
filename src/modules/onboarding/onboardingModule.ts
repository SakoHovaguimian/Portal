import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';

import { handleDemoOnboardingRequest } from './demo/handleDemoOnboardingRequest';
import { resetDemoOnboardingState } from './demo/onboardingState';

export const onboardingModule: PortalModule = {
  id: 'onboarding',
  ownsApiPath: (pathname) => /^\/onboarding(?:\/|$)/.test(pathname),
  pagePaths: ['/onboarding'],
  demo: {
    handle: handleDemoOnboardingRequest,
    reset: resetDemoOnboardingState,
  },
};
