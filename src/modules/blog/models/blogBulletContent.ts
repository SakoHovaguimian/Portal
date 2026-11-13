import { z } from 'zod';

import { portalPublishingStrings } from '@/strings';

const copy = portalPublishingStrings.builder;

export const BlogBulletContentSchema = z
  .object({
    id: z.string().uuid(),
    contentType: z.literal('bullet'),
    metaData: z
      .object({
        items: z
          .array(
            z
              .string()
              .trim()
              .min(1, copy.invalidItemsHint)
              .max(1000, copy.invalidItemsHint),
          )
          .min(1, copy.invalidItemsHint)
          .max(30, copy.invalidItemsHint),
      })
      .strict(),
  })
  .strict();

export type BlogBulletContent = z.infer<typeof BlogBulletContentSchema>;

export const BlogReadableBulletContentSchema = BlogBulletContentSchema.extend({
  metaData: z.object({ items: z.array(z.string()) }).passthrough(),
}).passthrough();
