import { z } from 'zod';

export const DashboardOverviewItemSchema = z.object({
  model: z.string(),
  displayName: z.string(),
  totalCount: z.number().int().nonnegative(),
  periodCount: z.number().int().nonnegative(),
  growthPercent: z.number().nullable(),
});

export const DashboardOverviewSchema = z.object({
  models: z.array(DashboardOverviewItemSchema),
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
});

export const DashboardModelMetaSchema = z.object({
  key: z.string(),
  displayName: z.string(),
  displayNameSingular: z.string(),
  totalRecords: z.number().int().nonnegative(),
  dateField: z.string(),
  labelField: z.string(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      displayName: z.string(),
      displayable: z.boolean(),
      filterable: z.boolean(),
      searchable: z.boolean(),
      sensitive: z.boolean(),
      sortable: z.boolean(),
      aggregatable: z.boolean(),
    }),
  ),
  relations: z.array(
    z.object({
      name: z.string(),
      model: z.string(),
      type: z.string(),
      foreignKey: z.string(),
      displayField: z.string(),
    }),
  ),
});

export const DashboardModelSummarySchema = z.object({
  key: z.string(),
  displayName: z.string(),
  fieldCount: z.number().int().nonnegative(),
  recordCount: z.number().int().nonnegative(),
});

export const DashboardRecordSchema = z.record(z.string(), z.unknown());

export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>;
export type DashboardModelMeta = z.infer<typeof DashboardModelMetaSchema>;
export type DashboardModelSummary = z.infer<typeof DashboardModelSummarySchema>;
export type DashboardRecord = z.infer<typeof DashboardRecordSchema>;
