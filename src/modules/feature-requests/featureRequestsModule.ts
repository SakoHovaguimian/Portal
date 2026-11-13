import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { strings } from '@/strings';

import { handleDemoFeatureRequests } from './demo/handleDemoFeatureRequests';

export const featureRequestsModule: PortalModule = {
  id: 'featureRequests',
  ownsApiPath: (pathname) => /^\/feature-requests(?:\/|$)/.test(pathname),
  navigation: {
    featureRequests: { href: '/feature-requests', label: strings.ui.appShell.featureRequests, icon: 'file' },
  },
  demo: { handle: handleDemoFeatureRequests },
};
