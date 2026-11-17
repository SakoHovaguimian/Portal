import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portalModuleStrings } from '@/strings';

import { resetDemoBlogState } from './server/demoBlogState';
import { handlePublishingRequest } from './server/handlePublishingRequest';

export const publishingModule: PortalModule = {
  id: 'publishing',
  ownsApiPath: (pathname) => /^\/(?:public\/)?blog(?:\/|$)/.test(pathname),
  navigation: {
    publishing: {
      href: '/blog',
      staffHref: '/admin/blog',
      label: portalModuleStrings.publishing,
      icon: 'layers',
    },
  },
  demo: {
    handle: ({ request, path, current, empty }) =>
      handlePublishingRequest({ request, path, actor: current, demoMode: true }, { empty }),
    reset: resetDemoBlogState,
  },
  live: (request, path, session, forward) =>
    handlePublishingRequest({ request, path, actor: session.user, demoMode: false, forward }),
};
