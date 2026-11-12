import 'server-only';
import { z } from 'zod';

// Shared Errors And Transport
import {
  NotFoundError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import type { BackendForward } from '@/services/api/models/backendForward';

// Inbox Models
import { NotificationArchiveInputSchema } from '../models/notificationArchiveInput';
import { NotificationBulkReadInputSchema } from '../models/notificationBulkReadInput';
import {
  NotificationInboxFiltersSchema,
  readNotificationInboxQuery,
} from '../models/notificationInboxQuery';
import {
  NotificationPreferencesInputSchema,
  NotificationPreferenceSchema,
} from '../models/notificationPreference';
import { NotificationReadInputSchema } from '../models/notificationReadInput';
import {
  NotificationDetectedTimezoneInputSchema,
  NotificationTimezoneInputSchema,
} from '../models/notificationTimezone';

// Transport Models And Mappers
import { NotificationCountsTransportSchema } from './models/notificationCountsTransport';
import { NotificationMutationTransportSchema } from './models/notificationMutationTransport';
import { NotificationPageTransportSchema } from './models/notificationPageTransport';
import { NotificationSettingsTransportSchema } from './models/notificationSettingsTransport';
import { NotificationTransportSchema } from './models/notificationTransport';
import {
  mapNotification,
  mapNotificationCounts,
  mapNotificationSettings,
  notificationFiltersTransport,
  notificationTransportParams,
} from './notificationInboxMappers';

class UpstreamNotificationResponseError extends Error {
  constructor(readonly response: Response) {
    super();
  }
}

// **************************************
// MARK: - CREATE NO STORE JSON RESPONSE
// **************************************

const createNotificationResponse = (body: unknown) =>
  Response.json(body, { headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE LIVE NOTIFICATION INBOX REQUEST
// **************************************

/** Authentication, refresh, origin verification, and credential ownership stay in the shared proxy. */
export async function handleLiveNotificationInboxRequest(
  request: Request,
  path: string,
  forward: BackendForward,
  userId?: string,
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, resource, action, ...extra] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);
  if (area !== 'portal' || feature !== 'notification-inbox') { return null; }
  if (extra.length) { throw new NotFoundError(); }

  // **************************************
  // MARK: - PARSE NOTIFICATION REQUEST BODY
  // **************************************

  const readRequestInput = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError();
    });

    return inputPromise;

  };

  // **************************************
  // MARK: - FORWARD AND VALIDATE NOTIFICATION RESPONSE
  // **************************************

  const readNotificationResponse = async <T extends z.ZodType>(
    schema: T,
    endpoint: string,
    method = 'GET',
    body?: unknown,
  ): Promise<z.output<T>> => {

    const response = await forward(
      new Request(request.url, {
        method,
        signal: request.signal,
        headers: {
          accept: 'application/json',
          ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      endpoint,
    );
    if (!response.ok) { throw new UpstreamNotificationResponseError(response); }
    return schema.parse(await response.json());

  };

  // **************************************
  // MARK: - MAP NOTIFICATION MUTATION RESPONSE
  // **************************************

  const forwardNotificationMutation = async (
    endpoint: string,
    method: string,
    body?: unknown,
  ) => {

    const result = await readNotificationResponse(
      NotificationMutationTransportSchema,
      endpoint,
      method,
      body,
    );

    return createNotificationResponse({
      affectedCount: result.affected_count,
      counts: mapNotificationCounts(result.counts),
    });

  };

  try {

    if (resource === 'counts' && !action && request.method === 'GET') {

      const filters = NotificationInboxFiltersSchema.omit({ read: true }).parse(
        Object.fromEntries(url.searchParams),
      );
      return createNotificationResponse(
        mapNotificationCounts(
          await readNotificationResponse(
            NotificationCountsTransportSchema,
            `/notifications/counts?${notificationTransportParams(filters)}`,
          ),
        ),
      );

    }
    if (resource === 'preferences' && !action) {

      if (request.method === 'GET') {

        return createNotificationResponse(
          await readNotificationResponse(
            z.array(NotificationPreferenceSchema),
            '/notifications/preferences',
          ),
        );

      }
      if (request.method === 'PUT') {

        return createNotificationResponse(
          await readNotificationResponse(
            z.array(NotificationPreferenceSchema),
            '/notifications/preferences',
            'PUT',
            NotificationPreferencesInputSchema.parse(await readRequestInput()),
          ),
        );

      }

    }
    if (resource === 'settings') {

      let settings;
      if (!action && request.method === 'GET') {

        settings = await readNotificationResponse(
          NotificationSettingsTransportSchema,
          '/user-settings',
        );

      }
      if (action === 'timezone' && request.method === 'PUT') {

        settings = await readNotificationResponse(
          NotificationSettingsTransportSchema,
          '/user-settings/timezone',
          'PUT',
          NotificationTimezoneInputSchema.parse(await readRequestInput()),
        );

      }
      if (action === 'last-timezone' && request.method === 'PUT') {

        const value = NotificationDetectedTimezoneInputSchema.parse(
          await readRequestInput(),
        );
        settings = await readNotificationResponse(
          NotificationSettingsTransportSchema,
          '/user-settings/last-timezone',
          'PUT',
          { last_timezone: value.lastTimezone },
        );

      }
      if (settings) {

        if (userId && settings.user_id !== userId) { throw new OwnershipError(); }
        return createNotificationResponse(mapNotificationSettings(settings));

      }
      throw new NotFoundError();

    }
    if (resource === 'read' && !action && request.method === 'PUT') {

      const value = NotificationBulkReadInputSchema.parse(await readRequestInput());
      return forwardNotificationMutation(
        '/notifications/read',
        'PUT',
        value.scope === 'FILTERED'
          ? { ...value, filters: notificationFiltersTransport(value.filters) }
          : value,
      );

    }
    if (!resource && request.method === 'GET') {

      const query = readNotificationInboxQuery(url.searchParams);
      const result = await readNotificationResponse(
        NotificationPageTransportSchema,
        `/notifications?${notificationTransportParams(query)}`,
      );
      if (
        userId &&
        result.data.some((item) => item.user_id !== userId)
      ) {
        throw new OwnershipError();
      }
      const notifications = result.data.map(mapNotification);
      return createNotificationResponse({
        data: notifications,
        page: result.page,
      });

    }
    if (!resource && request.method === 'DELETE') {

      const value = NotificationArchiveInputSchema.parse(await readRequestInput());
      const params = notificationTransportParams(
        value.scope === 'FILTERED' ? value.filters : {},
      );
      params.set('scope', value.scope);
      return forwardNotificationMutation(`/notifications?${params}`, 'DELETE');

    }
    if (resource) {

      const id = encodeURIComponent(z.string().uuid().parse(resource));
      if (!action && request.method === 'GET') {

        const item = await readNotificationResponse(
          NotificationTransportSchema,
          `/notifications/${id}`,
        );
        if (userId && item.user_id !== userId) {
          throw new OwnershipError();
        }
        return createNotificationResponse(mapNotification(item));

      }
      if (action === 'read' && request.method === 'PUT') {

        return forwardNotificationMutation(
          `/notifications/${id}/read`,
          'PUT',
          NotificationReadInputSchema.parse(await readRequestInput()),
        );

      }
      if (!action && request.method === 'DELETE') {
        return forwardNotificationMutation(`/notifications/${id}`, 'DELETE');
      }

    }
    throw new NotFoundError();

  } catch (error) {

    if (error instanceof UpstreamNotificationResponseError) { return error.response; }
    throw error;

  }

}
