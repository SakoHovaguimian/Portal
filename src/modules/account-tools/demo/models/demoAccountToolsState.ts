import type { DemoAccountDevice } from './demoAccountDevice';
import type { NotificationDelivery } from '../../models/notificationDelivery';
import type { NotificationDeliveryAttempt } from '../../models/notificationDeliveryAttempt';

export interface DemoAccountToolsState {
  devices: DemoAccountDevice[];
  deliveries: NotificationDelivery[];
  attempts: Map<string, NotificationDeliveryAttempt[]>;
}
