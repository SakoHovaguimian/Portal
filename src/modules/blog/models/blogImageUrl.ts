import { z } from 'zod';

import { isPublicImageReference } from '@/services/media/models/publicImageUrl';
import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const isBlogImageUrl = isPublicImageReference;

export const BlogImageUrlSchema = z
  .string()
  .trim()
  .max(2000, copy.invalidImageUrl)
  .refine(isBlogImageUrl, copy.invalidImageUrl);

export type BlogImageUrl = z.infer<typeof BlogImageUrlSchema>;
