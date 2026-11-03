import { z } from 'zod';
import { portalAccountToolsStrings as copy } from '@/strings';
import { AccountToolsPagingSchema } from './accountToolsPaging';
import { DeliveryStatusSchema } from './deliveryStatus';

export const NotificationDeliveryQuerySchema = AccountToolsPagingSchema.extend({
  notificationId: z.string().uuid().optional(),
  status: DeliveryStatusSchema.optional(),
  createdAfter: z.string().datetime({ offset: true }).optional(),
  createdBefore: z.string().datetime({ offset: true }).optional(),
})
  .strict()
  .refine(
    (value) =>
      !value.createdAfter ||
      !value.createdBefore ||
      Date.parse(value.createdAfter) <= Date.parse(value.createdBefore),
    { path: ['createdBefore'], message: copy.validation.dateRange },
  );

export type NotificationDeliveryQuery = z.infer<
  typeof NotificationDeliveryQuerySchema
>;
