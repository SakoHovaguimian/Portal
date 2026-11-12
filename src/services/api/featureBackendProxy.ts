import 'server-only';
import { portalModules } from '@/config/portalModules';
import { handlePublicImageRequest } from '@/services/media/server/handlePublicImageRequest';
import type { ServerSession } from '@/services/session/models/serverSession';

import { handleLiveAccountToolsRequest } from '@/modules/account-tools/server/handleLiveAccountToolsRequest';
import { handleLiveBackgroundJobRequest } from '@/modules/background-jobs/server/handleLiveBackgroundJobRequest';
import { handlePublishingRequest } from '@/modules/blog/server/handlePublishingRequest';
import { handleLiveChatRequest } from '@/modules/chat/server/handleLiveChatRequest';
import { handleLiveNotificationInboxRequest } from '@/modules/notification-inbox/server/handleLiveNotificationInboxRequest';
import type { BackendForward } from './models/backendForward';

// **************************************
// MARK: - PROXY OPTIONAL FEATURE REQUEST
// **************************************

export async function featureBackendProxy(
  request: Request,
  path: string,
  session: ServerSession,
  forward: BackendForward,
) {

  if (portalModules.chat) {

    const chat = await handleLiveChatRequest(request, path, forward);
    if (chat) { return chat; }

  }
  if (portalModules.backgroundJobs) {

    const job = await handleLiveBackgroundJobRequest(request, path, forward, session.user.id);
    if (job) { return job; }

  }
  const options = {
    request,
    path,
    actor: session.user,
    demoMode: false,
    forward,
  };
  if (portalModules.media) {

    const media = await handlePublicImageRequest(options);
    if (media) { return media; }

  }
  if (portalModules.publishing) {

    const blog = await handlePublishingRequest(options);
    if (blog) { return blog; }

  }
  if (portalModules.notifications) {

    const notifications = await handleLiveNotificationInboxRequest(
      request,
      path,
      forward,
      session.user.id,
    );
    if (notifications) { return notifications; }

  }
  if (portalModules.accountTools) {

    return handleLiveAccountToolsRequest(
      request,
      path,
      forward,
      session.user.id,
      session.user.role,
    );

  }
  return null;

}
