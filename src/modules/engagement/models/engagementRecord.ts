import { z } from 'zod';
import {
  EngagementKeySchema,
  EngagementTargetSchema,
} from './engagementTarget';

export { EngagementInputSchema } from './engagementInput';

export type { EngagementInput } from './engagementInput';

export const EngagementRecordSchema = EngagementKeySchema.extend({
  liked: z.boolean(),
  saved: z.boolean(),
  rating: z.number().int().min(1).max(5).nullable(),
  updatedAt: z.string().datetime(),
  target: EngagementTargetSchema.nullable(),
});

export const EngagementSummarySchema = EngagementRecordSchema.extend({
  likeCount: z.number().int().min(0),
});

export type EngagementRecord = z.infer<typeof EngagementRecordSchema>;

export type EngagementSummary = z.infer<typeof EngagementSummarySchema>;
