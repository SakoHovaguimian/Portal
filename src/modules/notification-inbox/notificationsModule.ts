import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portalModuleStrings } from '@/strings';

import { handleNotificationInboxRequest } from './demo/handleNotificationInboxRequest';
import { resetDemoNotificationInboxAccount, resetDemoNotificationInboxState } from './demo/notificationInboxState';
import { handleLiveNotificationInboxRequest } from './server/handleLiveNotificationInboxRequest';

export const notificationsModule: PortalModule = {
  id: 'notifications',
  ownsApiPath: (pathname) => /^\/(?:portal\/notification-inbox|notifications)(?:\/|$)/.test(pathname),
  navigation: {
    notifications: { href: '/notifications', label: portalModuleStrings.notifications, icon: 'bell' },
  },
  pagePaths: ['/settings/notifications'],
  demo: {
    handle: ({ request, path, session, empty, routing }) =>
      handleNotificationInboxRequest(request, path, session, {
        scenario: empty ? 'empty' : 'populated',
        latencyMs: 0,
      }, routing),
    reset: resetDemoNotificationInboxState,
    resetAccount: resetDemoNotificationInboxAccount,
  },
  live: (request, path, session, forward) =>
    handleLiveNotificationInboxRequest(request, path, forward, session.user.id),
};
