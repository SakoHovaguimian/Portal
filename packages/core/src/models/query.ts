import { z } from 'zod';

export const SortDirectionSchema = z.enum(['asc', 'desc']);

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const SortSchema = z.object({
  field: z.string(),
  direction: SortDirectionSchema.default('desc'),
});

export const UsersQuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
});

export const FeatureRequestQuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
  userId: z.string().uuid().optional(),
});

export const DashboardRecordsQuerySchema = PaginationSchema.extend({
  model: z.string(),
  search: z.string().optional(),
  tab: z.string().optional(),
  sort: SortSchema.optional(),
  filters: z.record(z.string(), z.string()).optional(),
});

export const PaginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
  });

export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type UsersQuery = z.infer<typeof UsersQuerySchema>;
export type FeatureRequestQuery = z.infer<typeof FeatureRequestQuerySchema>;
export type DashboardRecordsQuery = z.infer<typeof DashboardRecordsQuerySchema>;
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};
