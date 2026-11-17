import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogImageUrlSchema } from './blogImageUrl';

const copy = portalPublishingStrings.builder;

export const BlogImageSchema = z
  .object({
    src: BlogImageUrlSchema,
    alt: z
      .string()
      .trim()
      .min(1, copy.uploadAltRequiredHint)
      .max(500, copy.invalidImageHint),
    caption: z.string().trim().max(1000, copy.invalidCaptionHint).default(''),
  })
  .strict();

export type BlogImage = z.infer<typeof BlogImageSchema>;

export const BlogReadableImageSchema = z
  .object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })
  .passthrough();

export type BlogReadableImage = z.infer<typeof BlogReadableImageSchema>;
