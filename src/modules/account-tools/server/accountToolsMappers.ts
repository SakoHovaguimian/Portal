import type { AccountDeviceTransport } from './models/accountDeviceTransport';
import type { NotificationAttemptTransport } from './models/notificationAttemptTransport';
import type { NotificationDeliveryTransport } from './models/notificationDeliveryTransport';

// **************************************
// MARK: - MAP ACCOUNT DEVICE
// **************************************

export function mapAccountDevice(value: AccountDeviceTransport) {

  return {
    id: value.id,
    deviceType: value.device_type,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
  };

}

// **************************************
// MARK: - MAP NOTIFICATION DELIVERY
// **************************************

export function mapNotificationDelivery(value: NotificationDeliveryTransport) {

  return {
    id: value.id,
    notificationId: value.notification_id,
    channel: value.channel,
    status: value.status,
    attemptCount: value.attempt_count,
    nextAttemptAt: value.next_attempt_at,
    acceptedAt: value.accepted_at,
    error: value.error,
    skipReason: value.skip_reason,
    createdAt: value.created_at,
  };

}

// **************************************
// MARK: - MAP NOTIFICATION ATTEMPT
// **************************************

export function mapNotificationAttempt(value: NotificationAttemptTransport) {

  return {
    id: value.id,
    attemptNumber: value.attempt_number,
    startedAt: value.started_at,
    finishedAt: value.finished_at,
    outcome: value.outcome,
    retryable: value.retryable,
    error: value.error,
  };

}
