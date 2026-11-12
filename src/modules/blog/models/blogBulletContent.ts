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
              .min(1, copy.invalidItems)
              .max(1000, copy.invalidItems),
          )
          .min(1, copy.invalidItems)
          .max(30, copy.invalidItems),
      })
      .strict(),
  })
  .strict();

export type BlogBulletContent = z.infer<typeof BlogBulletContentSchema>;

export const BlogReadableBulletContentSchema = BlogBulletContentSchema.extend({
  metaData: z.object({ items: z.array(z.string()) }).passthrough(),
}).passthrough();
