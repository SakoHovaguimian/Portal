import { z } from 'zod';

import { portalMediaStrings as mediaCopy } from '@/strings';

export function isPublicHttpsUrl(value: string): boolean {

  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) { return false; }
  try {

    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      !host.includes('.')
    ) { return false; }
    return !/^(localhost|.*\.(localhost|local|internal|test|invalid)|127\..*|10\..*|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\..*|192\.0\..*|198\.(1[89]|51)\..*|203\.0\.113\..*|192\.168\..*|169\.254\..*|172\.(1[6-9]|2\d|3[01])\..*|0\..*|\[.*\])$/.test(
      host,
    );

  } catch {
    return false;
  }

}

export function isPublicImageUrl(value: string): boolean {

  if (!isPublicHttpsUrl(value)) { return false; }
  try {

    const url = new URL(value);
    const path = decodeURIComponent(url.pathname);
    return (
      !url.search &&
      !url.hash &&
      !path.includes('%') &&
      !/(^|\/)(private)(\/|$)/i.test(path)
    );

  } catch {
    return false;
  }

}

export function isPublicImageReference(value: string): boolean {

  return (
    isPublicImageUrl(value) ||
    /^\/api\/public\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      value,
    )
  );

}

export const PublicImageReferenceSchema = z
  .string()
  .trim()
  .max(2000, mediaCopy.imageUrlError)
  .refine(isPublicImageReference, mediaCopy.imageUrlError);
