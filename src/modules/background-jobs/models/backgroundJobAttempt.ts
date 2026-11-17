import { z } from 'zod';

import { BackgroundJobFailureSchema } from './backgroundJobFailure';
import { BackgroundJobStatusSchema } from './backgroundJobStatus';

export const BackgroundJobAttemptSchema = z.object({
  number: z.number().int().positive(),
  status: BackgroundJobStatusSchema,
  startedAt: z.iso.datetime().nullable(),
  finishedAt: z.iso.datetime().nullable(),
  failure: BackgroundJobFailureSchema.nullable(),
});

export type BackgroundJobAttempt = z.infer<typeof BackgroundJobAttemptSchema>;
