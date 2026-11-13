import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

import {
  BlogContentUrlSchema,
  BlogReadableContentUrlSchema,
} from './blogContentUrl';

const copy = portalPublishingStrings.builder;

export const BlogLinkContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('link'),
    metaData: z
      .object({
        url: BlogContentUrlSchema,
        text: z
          .string()
          .trim()
          .min(1, copy.invalidHeadingHint)
          .max(200, copy.invalidHeadingHint),
      })
      .strict(),
  })
  .strict();

export type BlogLinkContent = z.infer<typeof BlogLinkContentSchema>;

export const BlogReadableLinkContentSchema = BlogLinkContentSchema.extend({
  metaData: z
    .object({ url: BlogReadableContentUrlSchema, text: z.string() })
    .passthrough(),
}).passthrough();
