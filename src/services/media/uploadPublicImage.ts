import { ValidationError } from '@/errors/domainErrors';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { portalMediaStrings as mediaCopy } from '@/strings';

import {
  publicImageMaxBytes,
  publicImageMimeTypes,
  PublicImageSchema,
} from './models/publicImage';

// **************************************
// MARK: - UPLOAD PUBLIC IMAGE THROUGH PROXY
// **************************************

export async function uploadPublicImage(
  api: ApiClientInterface,
  file: File,
  path: string,
  signal?: AbortSignal,
) {

  if (!publicImageMimeTypes.some((type) => type === file.type)) { throw new ValidationError(mediaCopy.imageTypeError); }
  if (!file.size || file.size > publicImageMaxBytes) { throw new ValidationError(mediaCopy.imageSizeError); }
  const body = new FormData();
  body.set('file', file);
  body.set('mediaType', 'IMAGE');
  body.set('visibility', 'public');
  return PublicImageSchema.parse(
    await api.request(path, { method: 'POST', body, signal }),
  );

}
