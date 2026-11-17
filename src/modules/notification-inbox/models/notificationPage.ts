import { z } from 'zod';

import { NotificationInboxItemSchema } from './notificationInboxItem';
import { NotificationPageMetadataSchema } from './notificationPageMetadata';

export const NotificationPageSchema = z.object({
  data: z.array(NotificationInboxItemSchema),
  page: NotificationPageMetadataSchema,
});

export type NotificationPage = z.infer<typeof NotificationPageSchema>;
