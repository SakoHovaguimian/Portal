import { z } from 'zod';
export const DashboardModelSummarySchema = z.object({
  key: z.string(),
  displayName: z.string(),
  fieldCount: z.number().int().nonnegative(),
  recordCount: z.number().int().nonnegative(),
});
export type DashboardModelSummary = z.infer<typeof DashboardModelSummarySchema>;
