import { z } from 'zod';
import { EngagementRecordSchema } from './engagementRecord';
export const SavedQuerySchema = z.object({
  query: z.string().trim().max(200).default(''),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export const SavedPageSchema = z.object({
  data: z.array(EngagementRecordSchema),
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
});
export type SavedQuery = z.infer<typeof SavedQuerySchema>;
