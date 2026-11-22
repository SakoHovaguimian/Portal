import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portal__Name__Strings } from '@/strings';

import { handleDemo__Name__, reset__Name__ } from './demo/__key__Demo';
import { __key__ApiPath } from './__key__ApiPath';

export const __key__Module: PortalModule = {
  id: '__key__',
  navigation: {
    __key__: { href: '/__slug__', label: portal__Name__Strings.title, icon: 'layers' },
  },
  ownsApiPath: (pathname) => pathname === __key__ApiPath || pathname.startsWith(`${__key__ApiPath}/`),
  demo: { handle: handleDemo__Name__, reset: reset__Name__, resetAccount: reset__Name__ },
};
