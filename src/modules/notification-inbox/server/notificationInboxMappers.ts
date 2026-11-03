import type { NotificationTransport } from './models/notificationTransport';
import type { NotificationCountsTransport } from './models/notificationCountsTransport';
import type { NotificationSettingsTransport } from './models/notificationSettingsTransport';
import type {
  NotificationInboxFilters,
  NotificationInboxQuery,
} from '../models/notificationInboxQuery';

// **************************************
// MARK: - MAP NOTIFICATION
// **************************************

export function mapNotification(item: NotificationTransport) {

  return {
    id: item.id,
    userId: item.user_id,
    category: item.category,
    title: item.title,
    body: item.body,
    destination: item.destination,
    createdAt: item.created_at,
    publishedAt: item.published_at,
    readAt: item.read_at,
  };

}

// **************************************
// MARK: - MAP NOTIFICATION COUNTS
// **************************************

export function mapNotificationCounts(counts: NotificationCountsTransport) {

  return {
    totalCount: counts.total_count,
    unreadCount: counts.unread_count,
    readCount: counts.read_count,
  };

}

// **************************************
// MARK: - MAP NOTIFICATION SETTINGS
// **************************************

export function mapNotificationSettings(
  settings: NotificationSettingsTransport,
) {

  return {
    userId: settings.user_id,
    timezone: settings.timezone,
    lastTimezone: settings.last_timezone,
    lastTimezoneUpdatedAt: settings.last_timezone_updated_at,
    effectiveTimezone: settings.effective_timezone,
  };

}

// **************************************
// MARK: - MAP NOTIFICATION FILTERS TO TRANSPORT
// **************************************

export function notificationFiltersTransport(
  filters: NotificationInboxFilters,
) {

  return {
    ...filters,
    ...(filters.category ? { category: [filters.category] } : {}),
  };

}

// **************************************
// MARK: - MAP NOTIFICATION TRANSPORT PARAMETERS
// **************************************

export function notificationTransportParams(
  query: Partial<NotificationInboxQuery>,
) {

  const { category, sortOrder, ...fields } = query;
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {

    if (value !== undefined && value !== '') { params.set(key, String(value)); }

  });
  if (category) { params.append('category', category); }
  if (sortOrder) {

    params.set('sort_order', sortOrder);
    params.set('sort_by', 'published_at');

  }
  return params;

}
