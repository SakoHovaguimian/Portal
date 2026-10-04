import { z } from 'zod';
import { PaginationSchema } from './pagination';
export const UsersQuerySchema = PaginationSchema.extend({
  query: z.string().optional(),
});
export type UsersQuery = z.infer<typeof UsersQuerySchema>;
