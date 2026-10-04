import { z } from 'zod';
export const PaginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
  });

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};
