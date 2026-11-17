import 'server-only';

import { ApiError, OwnershipError } from '@/errors/domainErrors';
import type { MediaRequestOptions } from '@/services/media/server/models/mediaRequestOptions';
import { portalPublishingStrings } from '@/strings';

import { handleDemoBlogRequest } from './demoBlogApi';

// **************************************
// MARK: - HANDLE PUBLISHING REQUEST
// **************************************

export async function handlePublishingRequest(
  { request, path, actor, demoMode, forward }: MediaRequestOptions,
  options: { empty?: boolean } = {},
): Promise<Response | null> {

  const pathname = new URL(path, 'http://portal.internal').pathname;
  if (!/^\/(?:public\/)?blog(?:\/|$)/.test(pathname)) { return null; }
  const isPublic = pathname.startsWith('/public/');
  if (isPublic && request.method !== 'GET') { return new Response(null, { status: 405, headers: { allow: 'GET' } }); }
  if (!isPublic && actor?.role !== 'admin' && actor?.role !== 'superadmin') { throw new OwnershipError(portalPublishingStrings.article.permissionErrorHint); }
  if (demoMode) { return handleDemoBlogRequest(request, path, actor, options); }
  if (!forward) {

    throw new ApiError(
      portalPublishingStrings.article.adminErrorDescription,
      503,
    );

  }
  return forward(request, path);

}
