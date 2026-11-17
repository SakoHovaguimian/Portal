import 'server-only';
import { z } from 'zod';

import type { ProjectRouting } from '@/config/models/projectRouting';

// Shared Session And Demo Services
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@/errors/domainErrors';
import type { DemoContext } from '@/models/demoContext';
import { getDemoState } from '@/services/demo/demoState';
import type { ServerSession } from '@/services/session/models/serverSession';
import { portalNotificationInboxStrings as copy } from '@/strings';

// Inbox Models
import { NotificationArchiveInputSchema } from '../models/notificationArchiveInput';
import { NotificationBulkReadInputSchema } from '../models/notificationBulkReadInput';
import { NotificationInboxItemSchema } from '../models/notificationInboxItem';
import {
  NotificationInboxFiltersSchema,
  readNotificationInboxQuery,
  type NotificationInboxFilters,
} from '../models/notificationInboxQuery';
import { NotificationPreferencesInputSchema } from '../models/notificationPreference';
import { NotificationReadInputSchema } from '../models/notificationReadInput';
import {
  NotificationDetectedTimezoneInputSchema,
  NotificationTimezoneInputSchema,
} from '../models/notificationTimezone';
import type { NotificationUserSettings } from '../models/notificationUserSettings';

// Demo State
import type { DemoInboxNotification } from './models/demoInboxNotification';
import {
  defaultNotificationPreferences,
  getDemoNotificationInboxState,
} from './notificationInboxState';

// **************************************
// MARK: - CREATE DEMO NO STORE JSON RESPONSE
// **************************************

const createNotificationResponse = (body: unknown) =>
  Response.json(body, { headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE NOTIFICATION INBOX REQUEST
// **************************************

export async function handleNotificationInboxRequest(
  request: Request,
  path: string,
  session: ServerSession,
  context: DemoContext,
  routing: ProjectRouting,
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, resource, action, ...extra] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);
  if (area !== 'portal' || feature !== 'notification-inbox') { return null; }
  if (extra.length) { throw new NotFoundError(); }
  const currentUser = getDemoState().users.find(
    (user) =>
      user.id === session.user.id &&
      user.external_id === session.auth.externalId &&
      !user.deleted &&
      !user.disabled,
  );
  if (!session.demo || !currentUser) { throw new AuthError(); }

  const state = getDemoNotificationInboxState(routing);
  const now = new Date().toISOString();

  // **************************************
  // MARK: - PARSE DEMO NOTIFICATION REQUEST BODY
  // **************************************

  const readRequestInput = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError();
    });

    return inputPromise;

  };

  // **************************************
  // MARK: - CHECK DEMO NOTIFICATION VISIBILITY
  // **************************************

  const isNotificationVisible = (item: DemoInboxNotification) =>
    item.userId === currentUser.id &&
    !item.deleted &&
    item.status === 'PUBLISHED' &&
    item.inAppEnabled &&
    (!item.expiresAt || Date.parse(item.expiresAt) > Date.now());

  // **************************************
  // MARK: - FILTER DEMO NOTIFICATIONS
  // **************************************

  const getMatchingNotifications = (filters: NotificationInboxFilters = {}) => {

    const matchingItems = state.notifications.filter(
      (item) =>
        isNotificationVisible(item) &&
        (filters.read === undefined || Boolean(item.readAt) === filters.read) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.query ||
          `${item.title} ${item.body}`
            .toLocaleLowerCase('en-US')
            .includes(filters.query.toLocaleLowerCase('en-US'))),
    );

    return matchingItems;

  };

  // **************************************
  // MARK: - COUNT DEMO NOTIFICATIONS
  // **************************************

  const getNotificationCounts = (filters: NotificationInboxFilters = {}) => {

    const items = context.scenario === 'empty' ? [] : getMatchingNotifications(filters);
    const readCount = items.filter((item) => item.readAt !== null).length;
    return {
      totalCount: items.length,
      unreadCount: items.length - readCount,
      readCount,
    };

  };

  // **************************************
  // MARK: - REQUIRE DEMO NOTIFICATION
  // **************************************

  const requireNotification = (id: string) => {

    z.string().uuid().parse(id);
    const item = state.notifications.find(
      (item) => item.id === id && isNotificationVisible(item),
    );
    if (!item) { throw new NotFoundError(copy.validation.unavailable); }
    return item;

  };

  // **************************************
  // MARK: - GET DEMO NOTIFICATION SETTINGS
  // **************************************

  const getNotificationSettings = (): NotificationUserSettings =>
    state.settings.get(currentUser.id) ?? {
      userId: currentUser.id,
      timezone: null,
      lastTimezone: null,
      lastTimezoneUpdatedAt: null,
      effectiveTimezone: 'UTC',
    };

  // **************************************
  // MARK: - UPDATE DEMO NOTIFICATION READ STATE
  // **************************************

  const setNotificationReadState = (items: DemoInboxNotification[], read: boolean) => {

    const changed = items.filter((item) => Boolean(item.readAt) !== read);
    changed.forEach((item) => {
      item.readAt = read ? now : null;
    });
    return createNotificationResponse({ affectedCount: changed.length, counts: getNotificationCounts() });

  };
  if (resource === 'counts' && !action && request.method === 'GET') {

    return createNotificationResponse(
      getNotificationCounts(
        NotificationInboxFiltersSchema.omit({ read: true }).parse(
          Object.fromEntries(url.searchParams),
        ),
      ),
    );

  }
  if (resource === 'preferences' && !action) {

    if (request.method === 'GET') {

      return createNotificationResponse(
        state.preferences.get(currentUser.id) ?? defaultNotificationPreferences(),
      );

    }
    if (request.method === 'PUT') {

      const value = NotificationPreferencesInputSchema.parse(await readRequestInput());
      const preferences =
        state.preferences.get(currentUser.id) ?? defaultNotificationPreferences();
      value.preferences.forEach((entry) => {

        const index = preferences.findIndex(
          (item) =>
            item.category === entry.category && item.channel === entry.channel,
        );
        if (index >= 0) {
          preferences[index] = { ...entry };
        } else {
          preferences.push({ ...entry });
        }

      });
      state.preferences.set(currentUser.id, preferences);
      return createNotificationResponse(preferences);

    }

  }
  if (resource === 'settings') {

    const value = { ...getNotificationSettings() };
    if (!action && request.method === 'GET') { return createNotificationResponse(value); }
    if (action === 'timezone' && request.method === 'PUT') {

      value.timezone = NotificationTimezoneInputSchema.parse(
        await readRequestInput(),
      ).timezone;

    } else if (action === 'last-timezone' && request.method === 'PUT') {

      const detected = NotificationDetectedTimezoneInputSchema.parse(
        await readRequestInput(),
      ).lastTimezone;
      if (value.lastTimezone !== detected) {

        value.lastTimezone = detected;
        value.lastTimezoneUpdatedAt = now;

      }

    } else { throw new NotFoundError(); }
    value.effectiveTimezone = value.timezone ?? value.lastTimezone ?? 'UTC';
    state.settings.set(currentUser.id, value);
    return createNotificationResponse(value);

  }
  if (resource === 'read' && !action && request.method === 'PUT') {

    const value = NotificationBulkReadInputSchema.parse(await readRequestInput());
    const items =
      value.scope === 'SELECTED'
        ? value.ids.map(requireNotification)
        : getMatchingNotifications(value.scope === 'FILTERED' ? value.filters : {});
    return setNotificationReadState(items, value.read);

  }
  if (!resource && request.method === 'GET') {

    const query = readNotificationInboxQuery(url.searchParams);
    const items =
      context.scenario === 'empty'
        ? []
        : getMatchingNotifications(query).sort((left, right) => {

          const order =
            (left.publishedAt ?? left.createdAt).localeCompare(
              right.publishedAt ?? right.createdAt,
            ) || left.id.localeCompare(right.id);
          return query.sortOrder === 'asc' ? order : -order;

        });
    const hasMore = query.offset + query.limit < items.length;
    const pageItems = items.slice(query.offset, query.offset + query.limit);
    const notifications = pageItems.map((item) =>
      NotificationInboxItemSchema.parse(item),
    );
    return createNotificationResponse({
      data: notifications,
      page: {
        limit: query.limit,
        offset: query.offset,
        hasMore,
        nextOffset: hasMore ? query.offset + query.limit : null,
      },
    });

  }
  if (!resource && request.method === 'DELETE') {

    const value = NotificationArchiveInputSchema.parse(await readRequestInput());
    const items = getMatchingNotifications(value.scope === 'FILTERED' ? value.filters : {});
    items.forEach((item) => {
      item.deleted = true;
    });
    return createNotificationResponse({ affectedCount: items.length, counts: getNotificationCounts() });

  }
  if (resource) {

    const item = requireNotification(resource);
    if (!action && request.method === 'GET') {
      return createNotificationResponse(NotificationInboxItemSchema.parse(item));
    }
    if (action === 'read' && request.method === 'PUT') {

      return setNotificationReadState(
        [item],
        NotificationReadInputSchema.parse(await readRequestInput()).read,
      );

    }
    if (!action && request.method === 'DELETE') {

      item.deleted = true;
      return createNotificationResponse({ affectedCount: 1, counts: getNotificationCounts() });

    }

  }
  throw new NotFoundError();

}
