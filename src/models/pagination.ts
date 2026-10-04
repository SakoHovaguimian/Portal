import { z } from 'zod';
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});
export type Pagination = z.infer<typeof PaginationSchema>;
