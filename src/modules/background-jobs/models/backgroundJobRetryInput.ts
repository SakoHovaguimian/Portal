import { z } from 'zod';

export const BackgroundJobRetryInputSchema = z.object({
  idempotencyKey: z.uuid(),
  expectedAttempt: z.number().int().positive(),
}).strict();

export type BackgroundJobRetryInput = z.infer<typeof BackgroundJobRetryInputSchema>;
