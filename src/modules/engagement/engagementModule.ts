import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portalModuleStrings } from '@/strings';

import { handleDemoEngagementRequest } from './server/demoEngagementApi';
import { resetDemoEngagementState, resetUserDemoEngagement } from './server/demoEngagementState';

export const engagementModule: PortalModule = {
  id: 'engagement',
  ownsApiPath: (pathname) => /^\/engagement(?:\/|$)/.test(pathname),
  navigation: {
    saved: { href: '/saved', label: portalModuleStrings.saved, icon: 'bookmark' },
  },
  demo: {
    handle: ({ request, path, current, empty }) =>
      handleDemoEngagementRequest(request, path, current.id, { empty }),
    reset: resetDemoEngagementState,
    resetAccount: resetUserDemoEngagement,
  },
};
