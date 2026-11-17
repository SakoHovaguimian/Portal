import { z } from 'zod';

export const LegalItemSchema = z.object({
  title: z.string(),
  sections: z.array(z.string()),
});

export type LegalItem = z.infer<typeof LegalItemSchema>;
