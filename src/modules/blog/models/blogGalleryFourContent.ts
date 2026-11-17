import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import { BlogImageSchema, BlogReadableImageSchema } from './blogImage';

const copy = portalPublishingStrings.builder;

export const BlogGalleryFourContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('gallery4'),
    metaData: z
      .object({
        images: z.array(BlogImageSchema).length(4, copy.invalidGalleryHint),
        caption: z.string().trim().max(1000, copy.invalidCaptionHint).default(''),
      })
      .strict(),
  })
  .strict();

export type BlogGalleryFourContent = z.infer<
  typeof BlogGalleryFourContentSchema
>;

export const BlogReadableGalleryFourContentSchema =
  BlogGalleryFourContentSchema.extend({
    metaData: z
      .object({
        images: z.array(BlogReadableImageSchema),
        caption: z.string().optional(),
      })
      .passthrough(),
  }).passthrough();
