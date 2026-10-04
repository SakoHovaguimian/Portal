import type { NotificationStatus } from '@/services/notifications/models/notificationStatus';
export interface RealtimeContextValue {
  status: 'demo' | 'connecting' | 'connected' | 'offline';
  notificationStatus: NotificationStatus;
  enableNotifications(): Promise<void>;
  disableNotifications(): Promise<void>;
  prepareForLogout(): Promise<void>;
  simulateAlert(): void;
}
