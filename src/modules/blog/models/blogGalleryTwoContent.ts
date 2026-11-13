import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogImageSchema, BlogReadableImageSchema } from './blogImage';

const copy = portalPublishingStrings.builder;

export const BlogGalleryTwoContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('gallery2'),
    metaData: z
      .object({
        images: z.array(BlogImageSchema).length(2, copy.invalidGalleryHint),
        caption: z.string().trim().max(1000, copy.invalidCaptionHint).default(''),
      })
      .strict(),
  })
  .strict();

export type BlogGalleryTwoContent = z.infer<typeof BlogGalleryTwoContentSchema>;

export const BlogReadableGalleryTwoContentSchema =
  BlogGalleryTwoContentSchema.extend({
    metaData: z
      .object({
        images: z.array(BlogReadableImageSchema),
        caption: z.string().optional(),
      })
      .passthrough(),
  }).passthrough();
