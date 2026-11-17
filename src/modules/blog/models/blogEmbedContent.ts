import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import {
  BlogContentUrlSchema,
  BlogReadableContentUrlSchema,
} from './blogContentUrl';

const copy = portalPublishingStrings.builder;

export const BlogEmbedContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('embed'),
    metaData: z
      .object({
        url: BlogContentUrlSchema,
        title: z
          .string()
          .trim()
          .min(1, copy.invalidHeadingHint)
          .max(200, copy.invalidHeadingHint),
        caption: z.string().trim().max(1000, copy.invalidCaptionHint).default(''),
      })
      .strict(),
  })
  .strict();

export type BlogEmbedContent = z.infer<typeof BlogEmbedContentSchema>;

export const BlogReadableEmbedContentSchema = BlogEmbedContentSchema.extend({
  metaData: z
    .object({
      url: BlogReadableContentUrlSchema,
      title: z.string(),
      caption: z.string().optional(),
    })
    .passthrough(),
}).passthrough();
