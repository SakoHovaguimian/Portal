import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';

import { resetDemoPublicImages } from './server/demoPublicImages';
import { handlePublicImageRequest } from './server/handlePublicImageRequest';

export const mediaModule: PortalModule = {
  id: 'media',
  ownsApiPath: (pathname) => /^\/media(?:\/|$)/.test(pathname) || pathname === '/blog/media/upload',
  demo: {
    handle: ({ request, path, current }) =>
      handlePublicImageRequest({ request, path, actor: current, demoMode: true }),
    reset: resetDemoPublicImages,
  },
  live: (request, path, session, forward) =>
    handlePublicImageRequest({ request, path, actor: session.user, demoMode: false, forward }),
};
