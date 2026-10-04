import { z } from 'zod';
import { PaginationSchema } from './pagination';
import { SortSchema } from './sort';
export const DashboardRecordsQuerySchema = PaginationSchema.extend({
  model: z.string(),
  search: z.string().optional(),
  tab: z.string().optional(),
  sort: SortSchema.optional(),
  filters: z.record(z.string(), z.string()).optional(),
});
export type DashboardRecordsQuery = z.infer<typeof DashboardRecordsQuerySchema>;
