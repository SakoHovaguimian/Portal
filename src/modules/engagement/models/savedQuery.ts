import { z } from 'zod';

export { SavedPageSchema } from './savedPage';

export type { SavedPage } from './savedPage';

export const SavedQuerySchema = z.object({
  query: z.string().trim().max(200).default(''),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type SavedQuery = z.infer<typeof SavedQuerySchema>;
