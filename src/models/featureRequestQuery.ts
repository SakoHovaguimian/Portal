import { z } from 'zod';
import { PaginationSchema } from './pagination';
export const FeatureRequestQuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
  userId: z.string().uuid().optional(),
});
export type FeatureRequestQuery = z.infer<typeof FeatureRequestQuerySchema>;
