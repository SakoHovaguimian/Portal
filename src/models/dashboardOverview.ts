import { z } from 'zod';
import { DashboardOverviewItemSchema } from './dashboardOverviewItem';
export const DashboardOverviewSchema = z.object({
  models: z.array(DashboardOverviewItemSchema),
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
});
export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>;
