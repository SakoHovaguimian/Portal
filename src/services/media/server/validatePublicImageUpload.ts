import 'server-only';
import { ValidationError } from '@/errors/domainErrors';
import { portalMediaStrings as mediaCopy } from '@/strings';
import {
  publicImageMaxBytes,
  publicImageMimeTypes,
} from '../models/publicImage';
import { readImageUploadForm } from './readImageUploadForm';

const copy = mediaCopy;

// **************************************
// MARK: - VALIDATE PUBLIC IMAGE UPLOAD
// **************************************

export async function validatePublicImageUpload(
  request: Request,
): Promise<File> {

  const data = await readImageUploadForm(request);
  const file = data.get('file');
  if (!(file instanceof File)) { throw new ValidationError(copy.imageMissingError); }
  if (!publicImageMimeTypes.some((type) => type === file.type)) { throw new ValidationError(copy.imageTypeError); }
  if (!file.size || file.size > publicImageMaxBytes) { throw new ValidationError(copy.imageSizeError); }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const signatures: Record<string, () => boolean> = {
    'image/png': () => {

      const hasPngSignature = [137, 80, 78, 71, 13, 10, 26, 10].every(
        (value, index) => bytes[index] === value,
      );

      return hasPngSignature;

    },
    'image/jpeg': () =>
      bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    'image/gif': () =>
      /^GIF8[79]a$/.test(Buffer.from(bytes.subarray(0, 6)).toString('ascii')),
    'image/webp': () =>
      Buffer.from(bytes.subarray(0, 4)).toString('ascii') === 'RIFF' &&
      Buffer.from(bytes.subarray(8, 12)).toString('ascii') === 'WEBP',
  };
  if (!signatures[file.type]?.()) { throw new ValidationError(copy.imageInvalidError); }
  return file;

}
