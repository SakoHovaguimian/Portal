import { z } from 'zod';
import { BackgroundJobStatusSchema } from './backgroundJobStatus';

export const BackgroundJobQuerySchema = z.object({
  query: z.string().trim().max(200).default(''),
  status: BackgroundJobStatusSchema.optional(),
  offset: z.coerce.number().int().nonnegative().max(1000000).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type BackgroundJobQuery = z.infer<typeof BackgroundJobQuerySchema>;
