import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const BlogFooterContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('footer'),
    metaData: z
      .object({
        text: z
          .string()
          .trim()
          .min(1, copy.invalidShortTextHint)
          .max(4000, copy.invalidShortTextHint),
      })
      .strict(),
  })
  .strict();

export type BlogFooterContent = z.infer<typeof BlogFooterContentSchema>;

export const BlogReadableFooterContentSchema = BlogFooterContentSchema.extend({
  metaData: z.object({ text: z.string() }).passthrough(),
}).passthrough();
