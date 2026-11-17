import { z } from 'zod';

export const BackgroundJobProgressSchema = z.object({
  stage: z.string().min(1),
  completed: z.number().int().nonnegative(),
  total: z.number().int().positive(),
}).refine((value) => value.completed <= value.total);

export type BackgroundJobProgress = z.infer<typeof BackgroundJobProgressSchema>;
