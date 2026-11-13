import 'server-only';

import type { PortalModule } from './models/portalModule';
import { portalModules } from './portalModules';
import { mediaModule } from '@/services/media/mediaModule';

import { accountToolsModule } from '@/modules/account-tools/accountToolsModule';
import { backgroundJobsModule } from '@/modules/background-jobs/backgroundJobsModule';
import { publishingModule } from '@/modules/blog/publishingModule';
import { chatModule } from '@/modules/chat/chatModule';
import { dashboardModule } from '@/modules/dashboard/dashboardModule';
import { engagementModule } from '@/modules/engagement/engagementModule';
import { featureRequestsModule } from '@/modules/feature-requests/featureRequestsModule';
import { notificationsModule } from '@/modules/notification-inbox/notificationsModule';
import { onboardingModule } from '@/modules/onboarding/onboardingModule';
import { usersModule } from '@/modules/users/usersModule';

// Media must handle the shared blog upload path before publishing.
export const portalModuleRegistry: readonly PortalModule[] = [
  onboardingModule,
  chatModule,
  backgroundJobsModule,
  mediaModule,
  publishingModule,
  notificationsModule,
  engagementModule,
  accountToolsModule,
  dashboardModule,
  featureRequestsModule,
  usersModule,
];

export const enabledPortalModules = portalModuleRegistry.filter(({ id }) => portalModules[id]);
