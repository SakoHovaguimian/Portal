import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const BlogCalloutContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('callout'),
    metaData: z
      .object({
        title: z
          .string()
          .trim()
          .min(1, copy.invalidHeadingHint)
          .max(200, copy.invalidHeadingHint),
        text: z
          .string()
          .trim()
          .min(1, copy.invalidShortTextHint)
          .max(4000, copy.invalidShortTextHint),
      })
      .strict(),
  })
  .strict();

export type BlogCalloutContent = z.infer<typeof BlogCalloutContentSchema>;

export const BlogReadableCalloutContentSchema = BlogCalloutContentSchema.extend(
  {
    metaData: z.object({ title: z.string(), text: z.string() }).passthrough(),
  },
).passthrough();
