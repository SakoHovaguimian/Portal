import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { strings } from '@/strings';

import { handleDemoDashboard } from './demo/handleDemoDashboard';

export const dashboardModule: PortalModule = {
  id: 'dashboard',
  ownsApiPath: (pathname) => /^\/dashboard(?:\/|$)/.test(pathname),
  navigation: {
    dashboard: { href: '/dashboard', label: strings.ui.appShell.dashboard, icon: 'grid' },
  },
  demo: { handle: handleDemoDashboard },
};
