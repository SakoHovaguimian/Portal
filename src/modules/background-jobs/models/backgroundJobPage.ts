import { z } from 'zod';

import { BackgroundJobSchema } from './backgroundJob';

export const BackgroundJobPageSchema = z.object({
  data: z.array(BackgroundJobSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export type BackgroundJobPage = z.infer<typeof BackgroundJobPageSchema>;
