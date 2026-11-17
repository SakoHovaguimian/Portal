import type { NotificationCounts } from './notificationCounts';

export interface NotificationInboxSummaryProps {
  counts?: NotificationCounts;
  unavailable: boolean;
  filtered: boolean;
}
