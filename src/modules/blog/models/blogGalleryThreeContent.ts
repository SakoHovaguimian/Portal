import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogImageSchema, BlogReadableImageSchema } from './blogImage';

const copy = portalPublishingStrings.builder;

export const BlogGalleryThreeContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('gallery3'),
    metaData: z
      .object({
        images: z.array(BlogImageSchema).length(3, copy.invalidGalleryHint),
        caption: z.string().trim().max(1000, copy.invalidCaptionHint).default(''),
      })
      .strict(),
  })
  .strict();

export type BlogGalleryThreeContent = z.infer<
  typeof BlogGalleryThreeContentSchema
>;

export const BlogReadableGalleryThreeContentSchema =
  BlogGalleryThreeContentSchema.extend({
    metaData: z
      .object({
        images: z.array(BlogReadableImageSchema),
        caption: z.string().optional(),
      })
      .passthrough(),
  }).passthrough();
