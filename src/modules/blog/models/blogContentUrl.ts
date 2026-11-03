import { portalPublishingStrings } from '@/strings';
const copy = portalPublishingStrings.builder;
import { z } from 'zod';

import {
  isPublicHttpsUrl,
  isPublicImageReference,
} from '@/services/media/models/publicImageUrl';
export {
  isPublicHttpsUrl,
  isPublicImageUrl,
} from '@/services/media/models/publicImageUrl';

export const BlogContentUrlSchema = z
  .string()
  .trim()
  .max(2000, copy.invalidUrl)
  .refine(isPublicHttpsUrl, copy.invalidUrl);
export const isBlogImageUrl = isPublicImageReference;
export const BlogImageUrlSchema = z
  .string()
  .trim()
  .max(2000, copy.invalidImageUrl)
  .refine(isBlogImageUrl, copy.invalidImageUrl);

// Editors retain incomplete and older values; the reader checks URLs before use.
export const BlogReadableContentUrlSchema = z.string();
