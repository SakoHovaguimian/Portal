import 'server-only';

// Application and shared services
import { portalModules } from '@/config/portalModules';
import {
  registerDemoReset,
  registerDemoAccountReset,
} from '@/services/demo/demoResetRegistry';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import { resetDemoPublicImages } from '@/services/media/server/demoPublicImages';
import { handlePublicImageRequest } from '@/services/media/server/handlePublicImageRequest';

// Account tools
import { resetDemoAccountToolsState } from '@/modules/account-tools/demo/accountToolsState';
import { handleDemoAccountToolsRequest } from '@/modules/account-tools/demo/handleDemoAccountToolsRequest';

// Background jobs
import { resetDemoBackgroundJobs } from '@/modules/background-jobs/server/demoJobQueue';
import { handleDemoBackgroundJobRequest } from '@/modules/background-jobs/server/handleDemoBackgroundJobRequest';

// Blog
import { resetDemoBlogState } from '@/modules/blog/server/demoBlogState';
import { handlePublishingRequest } from '@/modules/blog/server/handlePublishingRequest';

// Chat
import { resetDemoChatState, resetDemoChatAccount } from '@/modules/chat/server/demoChatState';
import { handleDemoChatRequest } from '@/modules/chat/server/handleDemoChatRequest';

// Engagement
import { handleDemoEngagementRequest } from '@/modules/engagement/server/demoEngagementApi';
import {
  resetDemoEngagementState,
  resetUserDemoEngagement,
} from '@/modules/engagement/server/demoEngagementState';

// Notification inbox
import { handleNotificationInboxRequest } from '@/modules/notification-inbox/demo/handleNotificationInboxRequest';
import { resetDemoNotificationInboxState } from '@/modules/notification-inbox/demo/notificationInboxState';

// **************************************
// MARK: - COMPOSE DEMO MODULE HANDLERS
// **************************************

/** Compose optional domain handlers here; request simulation stays in DemoApiClient. */
export function createDemoModuleHandlers(): DemoRequestHandler[] {

  registerDemoReset('chat', resetDemoChatState);
  registerDemoAccountReset('chat', resetDemoChatAccount);
  registerDemoReset('jobs', () => resetDemoBackgroundJobs());
  registerDemoAccountReset('jobs', resetDemoBackgroundJobs);
  registerDemoReset('publishing', resetDemoBlogState);
  registerDemoReset('media', resetDemoPublicImages);
  registerDemoReset('notifications', resetDemoNotificationInboxState);
  registerDemoAccountReset('notifications', resetDemoNotificationInboxState);
  registerDemoReset('account-tools', resetDemoAccountToolsState);
  registerDemoAccountReset('account-tools', resetDemoAccountToolsState);
  registerDemoReset('engagement', resetDemoEngagementState);
  registerDemoAccountReset('engagement', resetUserDemoEngagement);
  const handlers: DemoRequestHandler[] = [
    async (context) => {

      const options = {
        request: context.request,
        path: context.path,
        actor: context.current,
        demoMode: true,
      };
      if (portalModules.chat) {

        const chat = await handleDemoChatRequest(context.request, context.path, context.current, { empty: context.empty });
        if (chat) { return chat; }

      }
      if (portalModules.backgroundJobs) {

        const job = await handleDemoBackgroundJobRequest(context.request, context.path, context.current.id, { empty: context.empty });
        if (job) { return job; }

      }
      if (portalModules.media) {

        const media = await handlePublicImageRequest(options);
        if (media) { return media; }

      }
      if (portalModules.publishing) {

        const content = await handlePublishingRequest(options, {
          empty: context.empty,
        });
        if (content) { return content; }

      }
      const simulation = {
        scenario: context.empty ? ('empty' as const) : ('populated' as const),
        latencyMs: 0,
      };
      if (portalModules.notifications) {

        const response = await handleNotificationInboxRequest(
          context.request,
          context.path,
          context.session,
          simulation,
        );
        if (response) { return response; }

      }
      if (portalModules.engagement) {

        const engagement = await handleDemoEngagementRequest(
          context.request,
          context.path,
          context.current.id,
          { empty: context.empty },
        );
        if (engagement) { return engagement; }

      }
      if (portalModules.accountTools) {

        return handleDemoAccountToolsRequest(
          context.request,
          context.path,
          context.session,
          simulation,
        );

      }
      return null;

    },
  ];

  return handlers;

}
