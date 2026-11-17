import { z } from 'zod';

import { EngagementRecordSchema } from './engagementRecord';

export const EngagementSummarySchema = EngagementRecordSchema.extend({
  likeCount: z.number().int().min(0),
});

export type EngagementSummary = z.infer<typeof EngagementSummarySchema>;
