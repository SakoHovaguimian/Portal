import { z } from 'zod';

export const DeliveryStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'ACCEPTED',
  'SKIPPED',
  'FAILED',
  'UNKNOWN',
]);

export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;
