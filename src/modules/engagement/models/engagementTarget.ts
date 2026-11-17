import { z } from 'zod';

import { EngagementKeySchema } from './engagementKey';

export const EngagementTargetSchema = EngagementKeySchema.extend({
  title: z.string().min(1).max(500),
  description: z.string().max(20000),
  href: z.string().regex(/^\/(?!\/)[^\\]*$/),
});

export type EngagementTarget = z.infer<typeof EngagementTargetSchema>;
