import { z } from 'zod';

import { DeliveryStatusSchema } from './deliveryStatus';

export const NotificationDeliveryAttemptSchema = z.object({
  id: z.string().uuid(),
  attemptNumber: z.number().int().positive(),
  startedAt: z.string().datetime({ offset: true }),
  finishedAt: z.string().datetime({ offset: true }).nullable(),
  outcome: DeliveryStatusSchema,
  retryable: z.boolean().nullable(),
  error: z.string().nullable(),
});

export type NotificationDeliveryAttempt = z.infer<
  typeof NotificationDeliveryAttemptSchema
>;
