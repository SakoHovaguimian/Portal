import { z } from 'zod';

import { EngagementKeySchema } from './engagementKey';
import { EngagementTargetSchema } from './engagementTarget';

export { EngagementInputSchema } from './engagementInput';

export type { EngagementInput } from './engagementInput';

export const EngagementRecordSchema = EngagementKeySchema.extend({
  liked: z.boolean(),
  saved: z.boolean(),
  rating: z.number().int().min(1).max(5).nullable(),
  updatedAt: z.string().datetime(),
  target: EngagementTargetSchema.nullable(),
});

export type EngagementRecord = z.infer<typeof EngagementRecordSchema>;
