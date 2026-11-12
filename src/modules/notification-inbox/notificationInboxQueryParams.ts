import type {
  NotificationInboxFilters,
  NotificationInboxQuery,
} from './models/notificationInboxQuery';

// **************************************
// MARK: - BUILD NOTIFICATION INBOX QUERY PARAMETERS
// **************************************

export function notificationInboxQueryParams(
  query: Partial<NotificationInboxQuery>,
) {

  const parameters = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {

    if (value !== undefined && value !== '') { parameters.set(key, String(value)); }

  });
  return parameters;

}

// **************************************
// MARK: - GET NOTIFICATION INBOX FILTERS
// **************************************

export function notificationInboxFilters(
  query: NotificationInboxQuery,
): NotificationInboxFilters {

  return {
    ...(query.query ? { query: query.query } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.read === undefined ? {} : { read: query.read }),
  };

}
