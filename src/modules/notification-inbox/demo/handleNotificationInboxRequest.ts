import 'server-only';
import { z } from 'zod';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@/errors/domainErrors';
import type { DemoContext } from '@/models/demoContext';
import type { ServerSession } from '@/services/session/models/serverSession';
import { getDemoState } from '@/services/demo/demoState';
import { portalNotificationInboxStrings as copy } from '@/strings';
import { NotificationInboxItemSchema } from '../models/notificationInboxItem';
import {
  NotificationInboxFiltersSchema,
  readNotificationInboxQuery,
  type NotificationInboxFilters,
} from '../models/notificationInboxQuery';
import { NotificationArchiveInputSchema } from '../models/notificationArchiveInput';
import { NotificationBulkReadInputSchema } from '../models/notificationBulkReadInput';
import { NotificationReadInputSchema } from '../models/notificationReadInput';
import { NotificationPreferencesInputSchema } from '../models/notificationPreference';
import {
  NotificationDetectedTimezoneInputSchema,
  NotificationTimezoneInputSchema,
} from '../models/notificationTimezone';
import type { NotificationUserSettings } from '../models/notificationUserSettings';
import {
  defaultNotificationPreferences,
  getDemoNotificationInboxState,
} from './notificationInboxState';
import type { DemoInboxNotification } from './models/demoInboxNotification';

export { resetDemoNotificationInboxState } from './notificationInboxState';

// **************************************
// MARK: - CREATE DEMO NO STORE JSON RESPONSE
// **************************************

const json = (body: unknown) =>
  Response.json(body, { headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE NOTIFICATION INBOX REQUEST
// **************************************

export async function handleNotificationInboxRequest(
  request: Request,
  path: string,
  session: ServerSession,
  context: DemoContext,
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, resource, action, ...extra] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);
  if (area !== 'portal' || feature !== 'notification-inbox') { return null; }
  if (extra.length) { throw new NotFoundError(); }
  const current = getDemoState().users.find(
    (user) =>
      user.id === session.user.id &&
      user.external_id === session.auth.externalId &&
      !user.deleted &&
      !user.disabled,
  );
  if (!session.demo || !current) { throw new AuthError(); }

  const state = getDemoNotificationInboxState();
  const now = new Date().toISOString();

  // **************************************
  // MARK: - PARSE DEMO NOTIFICATION REQUEST BODY
  // **************************************

  const input = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError();
    });

    return inputPromise;

  };

  // **************************************
  // MARK: - CHECK DEMO NOTIFICATION VISIBILITY
  // **************************************

  const visible = (item: DemoInboxNotification) =>
    item.userId === current.id &&
    !item.deleted &&
    item.status === 'PUBLISHED' &&
    item.inAppEnabled &&
    (!item.expiresAt || Date.parse(item.expiresAt) > Date.now());

  // **************************************
  // MARK: - FILTER DEMO NOTIFICATIONS
  // **************************************

  const matching = (filters: NotificationInboxFilters = {}) => {

    const matchingItems = state.notifications.filter(
      (item) =>
        visible(item) &&
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

  const counts = (filters: NotificationInboxFilters = {}) => {

    const items = context.scenario === 'empty' ? [] : matching(filters);
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
      (item) => item.id === id && visible(item),
    );
    if (!item) { throw new NotFoundError(copy.validation.unavailable); }
    return item;

  };

  // **************************************
  // MARK: - GET DEMO NOTIFICATION SETTINGS
  // **************************************

  const settings = (): NotificationUserSettings =>
    state.settings.get(current.id) ?? {
      userId: current.id,
      timezone: null,
      lastTimezone: null,
      lastTimezoneUpdatedAt: null,
      effectiveTimezone: 'UTC',
    };

  // **************************************
  // MARK: - UPDATE DEMO NOTIFICATION READ STATE
  // **************************************

  const readItems = (items: DemoInboxNotification[], read: boolean) => {

    const changed = items.filter((item) => Boolean(item.readAt) !== read);
    changed.forEach((item) => {
      item.readAt = read ? now : null;
    });
    return json({ affectedCount: changed.length, counts: counts() });

  };
  if (resource === 'counts' && !action && request.method === 'GET') {

    return json(
      counts(
        NotificationInboxFiltersSchema.omit({ read: true }).parse(
          Object.fromEntries(url.searchParams),
        ),
      ),
    );

  }
  if (resource === 'preferences' && !action) {

    if (request.method === 'GET') {

      return json(
        state.preferences.get(current.id) ?? defaultNotificationPreferences(),
      );

    }
    if (request.method === 'PUT') {

      const value = NotificationPreferencesInputSchema.parse(await input());
      const preferences =
        state.preferences.get(current.id) ?? defaultNotificationPreferences();
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
      state.preferences.set(current.id, preferences);
      return json(preferences);

    }

  }
  if (resource === 'settings') {

    const value = { ...settings() };
    if (!action && request.method === 'GET') { return json(value); }
    if (action === 'timezone' && request.method === 'PUT') {

      value.timezone = NotificationTimezoneInputSchema.parse(
        await input(),
      ).timezone;

    } else if (action === 'last-timezone' && request.method === 'PUT') {

      const detected = NotificationDetectedTimezoneInputSchema.parse(
        await input(),
      ).lastTimezone;
      if (value.lastTimezone !== detected) {

        value.lastTimezone = detected;
        value.lastTimezoneUpdatedAt = now;

      }

    } else { throw new NotFoundError(); }
    value.effectiveTimezone = value.timezone ?? value.lastTimezone ?? 'UTC';
    state.settings.set(current.id, value);
    return json(value);

  }
  if (resource === 'read' && !action && request.method === 'PUT') {

    const value = NotificationBulkReadInputSchema.parse(await input());
    const items =
      value.scope === 'SELECTED'
        ? value.ids.map(requireNotification)
        : matching(value.scope === 'FILTERED' ? value.filters : {});
    return readItems(items, value.read);

  }
  if (!resource && request.method === 'GET') {

    const query = readNotificationInboxQuery(url.searchParams);
    const items =
      context.scenario === 'empty'
        ? []
        : matching(query).sort((left, right) => {

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
    return json({
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

    const value = NotificationArchiveInputSchema.parse(await input());
    const items = matching(value.scope === 'FILTERED' ? value.filters : {});
    items.forEach((item) => {
      item.deleted = true;
    });
    return json({ affectedCount: items.length, counts: counts() });

  }
  if (resource) {

    const item = requireNotification(resource);
    if (!action && request.method === 'GET') {
      return json(NotificationInboxItemSchema.parse(item));
    }
    if (action === 'read' && request.method === 'PUT') {

      return readItems(
        [item],
        NotificationReadInputSchema.parse(await input()).read,
      );

    }
    if (!action && request.method === 'DELETE') {

      item.deleted = true;
      return json({ affectedCount: 1, counts: counts() });

    }

  }
  throw new NotFoundError();

}
