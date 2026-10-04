import { z } from 'zod';
export const SortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;
export const SortSchema = z.object({
  field: z.string(),
  direction: SortDirectionSchema.default('desc'),
});
export type Sort = z.infer<typeof SortSchema>;
