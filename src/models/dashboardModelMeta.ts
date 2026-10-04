import { z } from 'zod';
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
export type DashboardModelMeta = z.infer<typeof DashboardModelMetaSchema>;
