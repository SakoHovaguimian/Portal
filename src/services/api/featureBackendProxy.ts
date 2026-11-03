import 'server-only';
import type { ServerSession } from '@/services/session/models/serverSession';
import type { BackendForward } from './models/backendForward';
import { portalModules } from '@/config/portalModules';
import { handlePublishingRequest } from '@/modules/blog/server/handlePublishingRequest';
import { handlePublicImageRequest } from '@/services/media/server/handlePublicImageRequest';
import { handleLiveNotificationInboxRequest } from '@/modules/notification-inbox/server/handleLiveNotificationInboxRequest';
import { handleLiveAccountToolsRequest } from '@/modules/account-tools/server/handleLiveAccountToolsRequest';

export async function featureBackendProxy(
  request: Request,
  path: string,
  session: ServerSession,
  forward: BackendForward,
) {
  const options = {
    request,
    path,
    actor: session.user,
    demoMode: false,
    forward,
  };
  if (portalModules.media) {
    const media = await handlePublicImageRequest(options);
    if (media) return media;
  }
  if (portalModules.publishing) {
    const blog = await handlePublishingRequest(options);
    if (blog) return blog;
  }
  if (portalModules.notifications) {
    const notifications = await handleLiveNotificationInboxRequest(
      request,
      path,
      forward,
      session.user.id,
    );
    if (notifications) return notifications;
  }
  if (portalModules.accountTools)
    return handleLiveAccountToolsRequest(
      request,
      path,
      forward,
      session.user.id,
      session.user.role,
    );
  return null;
}
