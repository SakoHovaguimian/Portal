import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { strings } from '@/strings';

import { handleDemoUserDirectory } from './demo/handleDemoUserDirectory';

export const usersModule: PortalModule = {
  id: 'users',
  ownsApiPath: (pathname, currentUserId) =>
    /^\/users(?:\/|$)/.test(pathname) &&
    pathname !== '/users/profile' &&
    pathname !== `/users/${encodeURIComponent(currentUserId ?? '')}`,
  navigation: {
    users: { href: '/users', label: strings.ui.appShell.users, icon: 'user' },
  },
  demo: { handle: handleDemoUserDirectory },
};
