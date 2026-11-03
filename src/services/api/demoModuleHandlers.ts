import 'server-only';
import { portalModules } from '@/config/portalModules';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import {
  registerDemoReset,
  registerDemoAccountReset,
} from '@/services/demo/demoResetRegistry';
import { handlePublishingRequest } from '@/modules/blog/server/handlePublishingRequest';
import { resetDemoBlogState } from '@/modules/blog/server/demoBlogState';
import { handlePublicImageRequest } from '@/services/media/server/handlePublicImageRequest';
import { resetDemoPublicImages } from '@/services/media/server/demoPublicImages';
import { handleNotificationInboxRequest } from '@/modules/notification-inbox/demo/handleNotificationInboxRequest';
import { resetDemoNotificationInboxState } from '@/modules/notification-inbox/demo/notificationInboxState';
import { handleDemoAccountToolsRequest } from '@/modules/account-tools/demo/handleDemoAccountToolsRequest';
import { resetDemoAccountToolsState } from '@/modules/account-tools/demo/accountToolsState';
import { handleDemoEngagementRequest } from '@/modules/engagement/server/demoEngagementApi';
import {
  resetDemoEngagementState,
  resetUserDemoEngagement,
} from '@/modules/engagement/server/demoEngagementState';

// **************************************
// MARK: - COMPOSE DEMO MODULE HANDLERS
// **************************************

/** Compose optional domain handlers here; request simulation stays in DemoApiClient. */
export function createDemoModuleHandlers(): DemoRequestHandler[] {

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
