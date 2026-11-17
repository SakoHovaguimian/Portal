import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const BlogHeaderContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('header'),
    metaData: z
      .object({
        text: z
          .string()
          .trim()
          .min(1, copy.invalidHeadingHint)
          .max(200, copy.invalidHeadingHint),
      })
      .strict(),
  })
  .strict();

export type BlogHeaderContent = z.infer<typeof BlogHeaderContentSchema>;

export const BlogReadableHeaderContentSchema = BlogHeaderContentSchema.extend({
  metaData: z.object({ text: z.string() }).passthrough(),
}).passthrough();
