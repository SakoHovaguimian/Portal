import { z } from 'zod';

export const BackgroundJobStatusSchema = z.enum([
  'queued',
  'running',
  'succeeded',
  'failed',
  'canceled',
]);

export type BackgroundJobStatus = z.infer<typeof BackgroundJobStatusSchema>;
