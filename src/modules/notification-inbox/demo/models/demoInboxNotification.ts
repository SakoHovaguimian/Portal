import type { DemoInboxNotificationStatus } from './demoInboxNotificationStatus';
import type { NotificationInboxItem } from '../../models/notificationInboxItem';

export type DemoInboxNotification = NotificationInboxItem & {
  deleted: boolean;
  status: DemoInboxNotificationStatus;
  inAppEnabled: boolean;
  expiresAt: string | null;
};
