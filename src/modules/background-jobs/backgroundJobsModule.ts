import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { portalJobStrings } from '@/strings';

import { resetDemoBackgroundJobs } from './server/demoJobQueue';
import { handleDemoBackgroundJobRequest } from './server/handleDemoBackgroundJobRequest';
import { handleLiveBackgroundJobRequest } from './server/handleLiveBackgroundJobRequest';

export const backgroundJobsModule: PortalModule = {
  id: 'backgroundJobs',
  ownsApiPath: (pathname) => /^\/(?:portal\/)?jobs(?:\/|$)/.test(pathname),
  navigation: {
    backgroundJobs: { href: '/jobs', label: portalJobStrings.title, icon: 'clock' },
  },
  demo: {
    handle: ({ request, path, current, empty }) =>
      handleDemoBackgroundJobRequest(request, path, current.id, { empty }),
    reset: resetDemoBackgroundJobs,
    resetAccount: resetDemoBackgroundJobs,
  },
  live: (request, path, session, forward) =>
    handleLiveBackgroundJobRequest(request, path, forward, session.user.id),
};
