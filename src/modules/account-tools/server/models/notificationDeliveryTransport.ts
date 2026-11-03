import { z } from 'zod';
import { DeliveryChannelSchema } from '../../models/deliveryChannel';
import { DeliveryStatusSchema } from '../../models/deliveryStatus';

export const NotificationDeliveryTransportSchema = z.object({
  id: z.string().uuid(),
  notification_id: z.string().uuid(),
  channel: DeliveryChannelSchema,
  status: DeliveryStatusSchema,
  attempt_count: z.number().int().nonnegative(),
  next_attempt_at: z.string().datetime({ offset: true }).nullable(),
  accepted_at: z.string().datetime({ offset: true }).nullable(),
  error: z.string().nullable(),
  skip_reason: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }).nullable(),
});

export type NotificationDeliveryTransport = z.infer<
  typeof NotificationDeliveryTransportSchema
>;
