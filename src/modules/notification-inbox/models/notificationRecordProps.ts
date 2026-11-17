import type { NotificationInboxItem } from './notificationInboxItem';

export interface NotificationRecordProps {
  item: NotificationInboxItem;
  busy: boolean;
  onRead: (item: NotificationInboxItem) => void;
  onArchive: (item: NotificationInboxItem) => void;
}
