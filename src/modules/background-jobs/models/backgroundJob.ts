import { z } from 'zod';

import { portalJobStrings as copy } from '@/strings';

import { BackgroundJobAttemptSchema } from './backgroundJobAttempt';
import { BackgroundJobFailureSchema } from './backgroundJobFailure';
import { BackgroundJobProgressSchema } from './backgroundJobProgress';
import { BackgroundJobResultSchema } from './backgroundJobResult';
import { BackgroundJobStatusSchema } from './backgroundJobStatus';

export const BackgroundJobSchema = z.object({
  id: z.uuid(),
  userId: z.string().min(1),
  type: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  payload: z.record(z.string().max(80), z.json()).refine((value) => JSON.stringify(value).length <= 16384, { error: copy.errors.invalidInput }),
  status: BackgroundJobStatusSchema,
  progress: BackgroundJobProgressSchema,
  attempt: z.number().int().positive(),
  maxAttempts: z.number().int().min(1).max(10),
  retrySafe: z.boolean(),
  failure: BackgroundJobFailureSchema.nullable(),
  result: BackgroundJobResultSchema.nullable(),
  attempts: z.array(BackgroundJobAttemptSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
});

export type BackgroundJob = z.infer<typeof BackgroundJobSchema>;

export const BackgroundJobCreateInputSchema = BackgroundJobSchema.pick({
  type: true,
  name: true,
  payload: true,
}).extend({ idempotencyKey: z.uuid({ error: copy.errors.invalidInput }) }).strict();

export type BackgroundJobCreateInput = z.infer<typeof BackgroundJobCreateInputSchema>;
