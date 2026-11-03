import { z } from 'zod';

export const EngagementKeySchema = z
  .object({
    type: z.string().regex(/^[a-z][a-z0-9-]{0,39}$/),
    id: z.string().min(1).max(160),
  })
  .strict();

export const EngagementTargetSchema = EngagementKeySchema.extend({
  title: z.string().min(1).max(500),
  description: z.string().max(20000),
  href: z.string().regex(/^\/(?!\/)[^\\]*$/),
});

export type EngagementKey = z.infer<typeof EngagementKeySchema>;

export type EngagementTarget = z.infer<typeof EngagementTargetSchema>;
