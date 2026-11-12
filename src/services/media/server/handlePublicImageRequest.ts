import 'server-only';
import { OwnershipError, ApiError } from '@/errors/domainErrors';
import { portalPublishingStrings, portalMediaStrings } from '@/strings';

import { uploadDemoPublicImage } from './demoPublicImages';
import type { MediaRequestOptions } from './models/mediaRequestOptions';
import { validatePublicImageUpload } from './validatePublicImageUpload';

// **************************************
// MARK: - HANDLE PUBLIC IMAGE REQUEST
// **************************************

export async function handlePublicImageRequest({
  request,
  path,
  actor,
  demoMode,
  forward,
}: MediaRequestOptions): Promise<Response | null> {

  const pathname = new URL(path, 'http://portal.internal').pathname;
  if (!['/media/images', '/blog/media/upload'].includes(pathname)) { return null; }
  if (actor?.role !== 'admin' && actor?.role !== 'superadmin') { throw new OwnershipError(portalPublishingStrings.article.permissionError); }
  if (request.method !== 'POST') { return new Response(null, { status: 405, headers: { allow: 'POST' } }); }
  if (demoMode) { return uploadDemoPublicImage(request); }
  if (!forward) { throw new ApiError(portalMediaStrings.imageUploadError, 503); }
  const file = await validatePublicImageUpload(request.clone());
  const body = new FormData();
  body.set('file', file);
  body.set('mediaType', 'IMAGE');
  body.set('visibility', 'public');
  // Build a new multipart boundary; credentials are supplied by the server forwarder.
  return forward(
    new Request(request.url, { method: 'POST', body, signal: request.signal }),
    '/media/upload-media',
  );

}
