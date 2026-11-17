import type { NotificationDelivery } from './notificationDelivery';

export interface DeliveryAttemptsDialogProps {
  delivery: NotificationDelivery;
  offset: number;
  onNavigate: (offset: number) => void;
  onClose: () => void;
}
