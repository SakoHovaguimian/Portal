import { z } from 'zod';

export const SampleJobInputSchema = z.object({
  failFirstAttempt: z.boolean().default(false),
}).strict();

export type SampleJobInput = z.infer<typeof SampleJobInputSchema>;
