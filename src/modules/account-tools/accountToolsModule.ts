import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portalModuleStrings } from '@/strings';

import { resetDemoAccountToolsState } from './demo/accountToolsState';
import { handleDemoAccountToolsRequest } from './demo/handleDemoAccountToolsRequest';
import { handleLiveAccountToolsRequest } from './server/handleLiveAccountToolsRequest';

export const accountToolsModule: PortalModule = {
  id: 'accountTools',
  ownsApiPath: (pathname) => /^\/(?:portal|admin)\/account-tools(?:\/|$)/.test(pathname),
  navigation: {
    account: { href: '/settings/account', label: portalModuleStrings.account, icon: 'lock' },
    help: { href: '/help', label: portalModuleStrings.help, icon: 'info' },
  },
  pagePaths: ['/settings/devices', '/settings/delivery-history'],
  demo: {
    handle: ({ request, path, session, empty }) =>
      handleDemoAccountToolsRequest(request, path, session, {
        scenario: empty ? 'empty' : 'populated',
        latencyMs: 0,
      }),
    reset: resetDemoAccountToolsState,
    resetAccount: resetDemoAccountToolsState,
  },
  live: (request, path, session, forward) =>
    handleLiveAccountToolsRequest(request, path, forward, session.user.id, session.user.role),
};
