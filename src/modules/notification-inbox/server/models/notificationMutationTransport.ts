import { z } from 'zod';

import { NotificationCountsTransportSchema } from './notificationCountsTransport';

export const NotificationMutationTransportSchema = z.object({
  affected_count: z.number().int().nonnegative(),
  counts: NotificationCountsTransportSchema,
});

export type NotificationMutationTransport = z.infer<
  typeof NotificationMutationTransportSchema
>;
