import 'server-only';
import { ValidationError } from '@/errors/domainErrors';
import { portalMediaStrings as copy } from '@/strings';

import { publicImageMaxBytes } from '../models/publicImage';

// Bound the complete multipart body even when Content-Length is absent.

// **************************************
// MARK: - READ IMAGE UPLOAD FORM
// **************************************

export async function readImageUploadForm(request: Request): Promise<FormData> {

  const maxBytes = publicImageMaxBytes + 65536;
  if (Number(request.headers.get('content-length')) > maxBytes) { throw new ValidationError(copy.imageSizeErrorHint); }
  if (!request.body) { throw new ValidationError(copy.imageMissingErrorHint); }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {

    while (true) {

      const result = await reader.read();
      if (result.done) { break; }
      length += result.value.byteLength;
      if (length > maxBytes) {

        await reader.cancel();
        throw new ValidationError(copy.imageSizeErrorHint);

      }
      chunks.push(result.value);

    }

  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {

    bytes.set(chunk, offset);
    offset += chunk.byteLength;

  }
  const formDataPromise = new Response(bytes, {
    headers: { 'content-type': request.headers.get('content-type') ?? '' },
  })
    .formData()
    .catch(() => {
      throw new ValidationError(copy.imageMissingErrorHint);
    });

  return formDataPromise;

}
