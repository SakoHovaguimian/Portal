import { z } from 'zod';

import { EngagementRecordSchema } from './engagementRecord';

export const SavedPageSchema = z.object({
  data: z.array(EngagementRecordSchema),
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
});

export type SavedPage = z.infer<typeof SavedPageSchema>;
