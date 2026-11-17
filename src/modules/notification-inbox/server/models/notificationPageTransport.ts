import { z } from 'zod';

import { NotificationPageMetadataSchema } from '../../models/notificationPageMetadata';
import { NotificationTransportSchema } from './notificationTransport';

export const NotificationPageTransportSchema = z.object({
  data: z.array(NotificationTransportSchema),
  page: NotificationPageMetadataSchema,
});

export type NotificationPageTransport = z.infer<
  typeof NotificationPageTransportSchema
>;
