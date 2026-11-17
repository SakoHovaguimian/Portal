import type { NotificationCounts } from './notificationCounts';
import type { NotificationInboxQuery } from './notificationInboxQuery';

export interface NotificationInboxToolbarProps {
  query: NotificationInboxQuery;
  counts?: NotificationCounts;
  filtered: boolean;
  busy: boolean;
  hasNotifications: boolean;
  update: (values: Record<string, string | undefined>) => void;
  onReadAll: (read: boolean) => void;
  onArchiveAll: () => void;
}
