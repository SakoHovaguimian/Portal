import type { NotificationInboxQuery } from './notificationInboxQuery';

export interface NotificationDirectoryFiltersProps {
  query: NotificationInboxQuery;
  update: (values: Record<string, string | undefined>) => void;
}
