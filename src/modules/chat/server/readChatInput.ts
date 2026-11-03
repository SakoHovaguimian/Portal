import 'server-only';
import { ValidationError } from '@/errors/domainErrors';
import { portalChatStrings as copy } from '@/strings';
// **************************************
// MARK: - READ BOUNDED CHAT REQUEST INPUT
// **************************************

export async function readChatInput(request: Request): Promise<unknown> {

  const limit = 29 * 1024 * 1024;
  if (Number(request.headers.get('content-length')) > limit) {
    throw new ValidationError(copy.validation.attachment);
  }
  if (!request.body) {
    throw new ValidationError(copy.validation.invalid);
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {

    while (true) {

      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      size += value.byteLength;
      if (size > limit) {

        await reader.cancel();
        throw new ValidationError(copy.validation.attachment);

      }
      chunks.push(value);

    }
    const body = Buffer.concat(chunks);
    return JSON.parse(body.toString('utf8')) as unknown;

  } catch (error) {

    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(copy.validation.invalid);

  } finally {
    reader.releaseLock();
  }

}
