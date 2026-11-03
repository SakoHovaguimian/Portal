import { z } from 'zod';

export const BackgroundJobFailureSchema = z.object({
  code: z.string(),
  message: z.string().max(2000),
  retryable: z.boolean(),
});

export type BackgroundJobFailure = z.infer<typeof BackgroundJobFailureSchema>;
