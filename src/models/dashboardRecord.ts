import { z } from 'zod';
export const DashboardRecordSchema = z.record(z.string(), z.unknown());
export type DashboardRecord = z.infer<typeof DashboardRecordSchema>;
