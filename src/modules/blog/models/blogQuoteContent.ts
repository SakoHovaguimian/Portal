import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const BlogQuoteContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('quote'),
    metaData: z
      .object({
        text: z
          .string()
          .trim()
          .min(1, copy.invalidShortTextHint)
          .max(4000, copy.invalidShortTextHint),
        attribution: z
          .string()
          .trim()
          .max(200, copy.invalidAttributionHint)
          .default(''),
      })
      .strict(),
  })
  .strict();

export type BlogQuoteContent = z.infer<typeof BlogQuoteContentSchema>;

export const BlogReadableQuoteContentSchema = BlogQuoteContentSchema.extend({
  metaData: z
    .object({ text: z.string(), attribution: z.string().optional() })
    .passthrough(),
}).passthrough();
