import 'server-only';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@/errors/domainErrors';
import { portalEngagementStrings as copy } from '@/strings';
import { EngagementKeySchema } from '../models/engagementTarget';
import { EngagementInputSchema } from '../models/engagementInput';
import { SavedQuerySchema } from '../models/savedQuery';
import { getDemoEngagementState } from './demoEngagementState';
import { resolveEngagementTarget } from './engagementTargetRegistry';

// **************************************
// MARK: - CREATE ENGAGEMENT RESPONSE
// **************************************

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE DEMO ENGAGEMENT REQUEST
// **************************************

export async function handleDemoEngagementRequest(
  request: Request,
  path: string,
  userId: string | null,
  options: { empty?: boolean } = {},
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] !== 'engagement') { return null; }
  if (!userId) { throw new AuthError(copy.signInHint); }

  // **************************************
  // MARK: - READ DEMO ENGAGEMENT REQUEST BODY
  // **************************************

  const input = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError(copy.invalidInput);
    });

    return inputPromise;

  };
  const state = getDemoEngagementState();
  if (parts[1] === 'saved' && parts.length === 2) {

    if (request.method === 'GET') {

      const query = SavedQuerySchema.parse(
        Object.fromEntries(url.searchParams),
      );
      const rows = await Promise.all(
        (options.empty ? [] : state)
          .filter((item) => item.userId === userId && item.saved)
          .map(async (item) => ({
            type: item.type,
            id: item.id,
            liked: item.liked,
            saved: item.saved,
            rating: item.rating,
            updatedAt: item.updatedAt,
            target: await resolveEngagementTarget(item.type, item.id),
          })),
      );
      const filtered = rows
        .filter(
          (item) =>
            !query.query ||
            `${item.target?.title ?? ''} ${item.target?.description ?? ''}`
              .toLocaleLowerCase('en-US')
              .includes(query.query.toLocaleLowerCase('en-US')),
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const offset = filtered.length
        ? Math.min(
          query.offset,
          Math.floor((filtered.length - 1) / query.limit) * query.limit,
        )
        : 0;
      return json({
        data: filtered.slice(offset, offset + query.limit),
        total: filtered.length,
        limit: query.limit,
        offset,
      });

    }
    if (request.method === 'DELETE') {

      const key = EngagementKeySchema.parse(await input());
      const record = state.find(
        (item) =>
          item.userId === userId &&
          item.type === key.type &&
          item.id === key.id,
      );
      if (record) {

        record.saved = false;
        record.updatedAt = new Date().toISOString();

      }
      return new Response(null, {
        status: 204,
        headers: { 'cache-control': 'no-store' },
      });

    }

  }
  if (parts.length !== 3) { throw new NotFoundError(copy.unavailableDescription); }
  const key = EngagementKeySchema.parse({ type: parts[1], id: parts[2] });
  const target = await resolveEngagementTarget(key.type, key.id);
  if (!target) { throw new NotFoundError(copy.unavailableDescription); }
  let record = state.find(
    (item) =>
      item.userId === userId && item.type === key.type && item.id === key.id,
  );
  if (request.method === 'PUT') {

    const values = EngagementInputSchema.parse(await input());
    if (!record) {

      record = {
        ...key,
        userId,
        liked: false,
        saved: false,
        rating: null,
        updatedAt: new Date().toISOString(),
      };
      state.push(record);

    }
    Object.assign(record, values, { updatedAt: new Date().toISOString() });

  } else if (request.method !== 'GET') { return new Response(null, { status: 405, headers: { allow: 'GET, PUT' } }); }
  const updatedAt = record?.updatedAt ?? new Date().toISOString();
  const likeCount = state.filter(
    (item) => item.type === key.type && item.id === key.id && item.liked,
  ).length;
  const engagementSummary = {
    ...key,
    liked: record?.liked ?? false,
    saved: record?.saved ?? false,
    rating: record?.rating ?? null,
    updatedAt,
    target,
    likeCount,
  };
  return json(engagementSummary);

}
