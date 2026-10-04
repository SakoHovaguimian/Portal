import { z } from 'zod';
export const DashboardOverviewItemSchema = z.object({
  model: z.string(),
  displayName: z.string(),
  totalCount: z.number().int().nonnegative(),
  periodCount: z.number().int().nonnegative(),
  growthPercent: z.number().nullable(),
});
export type DashboardOverviewItem = z.infer<typeof DashboardOverviewItemSchema>;
