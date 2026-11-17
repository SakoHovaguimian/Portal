import { z } from 'zod';

export const BlogRevisionInputSchema = z
  .object({
    revision: z.number().int().min(1),
  })
  .strict();

export type BlogRevisionInput = z.infer<typeof BlogRevisionInputSchema>;
