import { z } from 'zod';
import { DeliveryChannelSchema } from './deliveryChannel';
import { DeliveryStatusSchema } from './deliveryStatus';

export { DeliveryStatusSchema } from './deliveryStatus';

export type { DeliveryStatus } from './deliveryStatus';

export { DeliveryChannelSchema } from './deliveryChannel';

export type { DeliveryChannel } from './deliveryChannel';

export const NotificationDeliverySchema = z.object({
  id: z.string().uuid(),
  notificationId: z.string().uuid(),
  channel: DeliveryChannelSchema,
  status: DeliveryStatusSchema,
  attemptCount: z.number().int().nonnegative(),
  nextAttemptAt: z.string().datetime({ offset: true }).nullable(),
  acceptedAt: z.string().datetime({ offset: true }).nullable(),
  error: z.string().nullable(),
  skipReason: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }).nullable(),
});

export type NotificationDelivery = z.infer<typeof NotificationDeliverySchema>;
