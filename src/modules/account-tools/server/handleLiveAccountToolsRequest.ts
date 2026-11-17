import 'server-only';
import { z } from 'zod';

import {
  NotFoundError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import type { BackendForward } from '@/services/api/models/backendForward';
import { portalAccountToolsStrings as copy } from '@/strings';

import { accountToolsQueryParams } from '../accountToolsQueryParams';
import { AccountDeletionSchema } from '../models/accountDeletion';
import { AccountDeviceQuerySchema } from '../models/accountDeviceQuery';
import { accountToolsPageSchema } from '../models/accountToolsPage';
import { AccountToolsPagingSchema } from '../models/accountToolsPaging';
import { LegalInformationQuerySchema } from '../models/legalInformationQuery';
import { LegalItemSchema } from '../models/legalItem';
import { NotificationDeliveryQuerySchema } from '../models/notificationDeliveryQuery';
import {
  mapAccountDevice,
  mapNotificationDelivery,
  mapNotificationAttempt,
} from './accountToolsMappers';
import { AccountDeletionProfileTransportSchema } from './models/accountDeletionProfileTransport';
import { AccountDeviceTransportSchema } from './models/accountDeviceTransport';
import { FrequentlyAskedQuestionsTransportSchema } from './models/frequentlyAskedQuestionsTransport';
import { NotificationAttemptTransportSchema } from './models/notificationAttemptTransport';
import { NotificationDeliveryTransportSchema } from './models/notificationDeliveryTransport';

class UpstreamResponse extends Error {
  constructor(readonly response: Response) {
    super();
  }
}

// **************************************
// MARK: - CREATE ACCOUNT TOOLS RESPONSE
// **************************************

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - CREATE NO-CONTENT RESPONSE
// **************************************

const noContent = () =>
  new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE LIVE ACCOUNT TOOLS REQUEST
// **************************************

/** The authenticated proxy owns session verification, origin checks, and refresh. */
export async function handleLiveAccountToolsRequest(
  request: Request,
  path: string,
  forward: BackendForward,
  userId?: string,
  role?: string,
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, resource, id, action, ...extra] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);
  if (feature !== 'account-tools' || !['portal', 'admin'].includes(area)) { return null; }
  if (extra.length) { throw new NotFoundError(); }
  const administrative = area === 'admin';
  if (administrative && role !== 'superadmin') { throw new OwnershipError(); }
  const method = request.method;

  // **************************************
  // MARK: - READ ACCOUNT TOOLS REQUEST BODY
  // **************************************

  const readInput = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError();
    });

    return inputPromise;

  };

  // **************************************
  // MARK: - FORWARD ACCOUNT TOOLS REQUEST
  // **************************************

  const call = async (upstreamPath: string, verb = 'GET', body?: unknown) => {

    const response = await forward(
      new Request(request.url, {
        method: verb,
        signal: request.signal,
        headers: {
          accept: 'application/json',
          ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      upstreamPath,
    );
    if (!response.ok) { throw new UpstreamResponse(response); }
    return response;

  };

  // **************************************
  // MARK: - READ VALIDATED ACCOUNT TOOLS RESPONSE
  // **************************************

  const read = async <T extends z.ZodType>(
    schema: T,
    upstreamPath: string,
    verb = 'GET',
    body?: unknown,
  ): Promise<z.output<T>> =>
    schema.parse(await (await call(upstreamPath, verb, body)).json());
  try {

    if (!administrative) {

      if (resource === 'account' && !id && !action && method === 'DELETE') {

        const input = AccountDeletionSchema.parse(await readInput());
        const account = await read(
          AccountDeletionProfileTransportSchema,
          '/users/profile',
        );
        if (userId && account.id !== userId) { throw new OwnershipError(); }
        if (account.email !== input.confirmationEmail) { throw new ValidationError(copy.validation.emailMismatch); }
        await call(`/users/${encodeURIComponent(account.id)}`, 'DELETE');
        // The caller clears the encrypted session cookie only after success.
        return noContent();

      }
      if (resource === 'devices' && !action) {

        if (!id && method === 'GET') {

          const query = AccountDeviceQuerySchema.parse(
            Object.fromEntries(url.searchParams),
          );
          // This backend's current-user device endpoint returns an array. Keep
          // presentation paging here and never forward device tokens to React.
          const devices = await read(
            z.array(AccountDeviceTransportSchema),
            '/devices',
          );
          const hasForeignDevice = userId && devices.some((device) => device.user_id !== userId);
          if (hasForeignDevice) { throw new OwnershipError(); }
          const search = query.query.toLocaleLowerCase('en-US');
          const matching = devices.filter(
            (device) =>
              (!query.deviceType || device.device_type === query.deviceType) &&
              device.device_type.toLocaleLowerCase('en-US').includes(search),
          );
          const hasMore = query.offset + query.limit < matching.length;
          const deviceRows = matching
            .slice(query.offset, query.offset + query.limit)
            .map(mapAccountDevice);
          const responseBody = {
            data: deviceRows,
            page: {
              limit: query.limit,
              offset: query.offset,
              hasMore,
              nextOffset: hasMore ? query.offset + query.limit : null,
            },
          };
          return json(responseBody);

        }
        if (id && method === 'DELETE') {

          const device = await read(
            AccountDeviceTransportSchema,
            `/devices/${encodeURIComponent(z.string().uuid().parse(id))}`,
          );
          if (userId && device.user_id !== userId) { throw new OwnershipError(); }
          await call('/devices', 'DELETE', {
            device_token: device.device_token,
          });
          return noContent();

        }

      }
      if (resource === 'legal' && !id && !action && method === 'GET') {

        const { context } = LegalInformationQuerySchema.parse(
          Object.fromEntries(url.searchParams),
        );
        const items = await read(
          z.array(LegalItemSchema),
          `/system/legal-information?${accountToolsQueryParams({ context })}`,
        );
        return json({ illustrative: false, items });

      }
      if (resource === 'faq' && !id && !action && method === 'GET') {

        const value = await read(
          FrequentlyAskedQuestionsTransportSchema,
          '/system/faq',
        );
        return json({ illustrative: false, sections: value.sections });

      }

    } else {

      if (resource === 'deliveries') {

        if (!id && !action && method === 'GET') {

          const query = NotificationDeliveryQuerySchema.parse(
            Object.fromEntries(url.searchParams),
          );
          const params = accountToolsQueryParams({
            notification_id: query.notificationId,
            status: query.status,
            created_after: query.createdAfter,
            created_before: query.createdBefore,
            limit: query.limit,
            offset: query.offset,
          });
          const result = await read(
            accountToolsPageSchema(NotificationDeliveryTransportSchema),
            `/notification-deliveries?${params}`,
          );
          const deliveries = result.data.map(mapNotificationDelivery);
          const responseBody = {
            data: deliveries,
            page: result.page,
          };
          return json(responseBody);

        }
        if (id && action === 'attempts' && method === 'GET') {

          const paging = AccountToolsPagingSchema.strict().parse(
            Object.fromEntries(url.searchParams),
          );
          const result = await read(
            accountToolsPageSchema(NotificationAttemptTransportSchema),
            `/notification-deliveries/${encodeURIComponent(z.string().uuid().parse(id))}/attempts?${accountToolsQueryParams(paging)}`,
          );
          const attempts = result.data.map(mapNotificationAttempt);
          const responseBody = {
            data: attempts,
            page: result.page,
          };
          return json(responseBody);

        }

      }

    }
    throw new NotFoundError();

  } catch (error) {

    if (error instanceof UpstreamResponse) { return error.response; }
    throw error;

  }

}
