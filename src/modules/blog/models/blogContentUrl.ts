import { z } from 'zod';

import { isPublicHttpsUrl } from '@/services/media/models/publicImageUrl';
import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export {
  isBlogImageUrl,
  BlogImageUrlSchema,
} from './blogImageUrl';

export type { BlogImageUrl } from './blogImageUrl';

export {
  isPublicHttpsUrl,
  isPublicImageUrl,
} from '@/services/media/models/publicImageUrl';

export const BlogContentUrlSchema = z
  .string()
  .trim()
  .max(2000, copy.invalidUrlHint)
  .refine(isPublicHttpsUrl, copy.invalidUrlHint);

// Editors retain incomplete and older values; the reader checks URLs before use.
export const BlogReadableContentUrlSchema = z.string();
