import 'server-only';
import { z } from 'zod';
import type { BackendForward } from '@/services/api/models/backendForward';
import { NotFoundError, OwnershipError, ValidationError } from '@/errors/domainErrors';
import { validateInput } from '@/utils/validateInput';
import { portalJobStrings as copy } from '@/strings';
import { BackgroundJobSchema, BackgroundJobCreateInputSchema } from '../models/backgroundJob';
import { BackgroundJobPageSchema } from '../models/backgroundJobPage';
import { BackgroundJobQuerySchema } from '../models/backgroundJobQuery';
import { BackgroundJobRetryInputSchema } from '../models/backgroundJobRetryInput';

// **************************************
// MARK: - HANDLE LIVE BACKGROUND JOB REQUEST
// **************************************

/** Only validates and proxies. Production work runs in the backend's durable queue. */
export async function handleLiveBackgroundJobRequest(request: Request, path: string, forward: BackendForward, userId: string): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, rawId, action, ...extra] = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (area !== 'portal' || feature !== 'jobs') { return null; }
  if (extra.length || (action && action !== 'cancel' && action !== 'retry')) { throw new NotFoundError(copy.errors.unavailable); }
  const headers = { 'cache-control': 'no-store' };
  let endpoint = '/jobs';
  let body: unknown;
  if (rawId) {

    const id = validateInput(z.uuid(), rawId);
    endpoint += `/${encodeURIComponent(id)}${action ? `/${action}` : ''}`;
    if ((!action && request.method !== 'GET') || (action && request.method !== 'POST')) { return new Response(null, { status: 405, headers: { ...headers, allow: action ? 'POST' : 'GET' } }); }

  } else if (request.method === 'GET') {

    const query = validateInput(BackgroundJobQuerySchema, Object.fromEntries(url.searchParams));
    const params = new URLSearchParams({ query: query.query, limit: String(query.limit), offset: String(query.offset) });
    if (query.status) { params.set('status', query.status); }
    endpoint += `?${params}`;

  } else if (request.method !== 'POST') { return new Response(null, { status: 405, headers: { ...headers, allow: 'GET, POST' } }); }
  if (request.method === 'POST' && action !== 'cancel') {

    let value: unknown;
    try { value = await request.json(); } catch { throw new ValidationError(copy.errors.invalidInput); }
    body = action === 'retry' ? validateInput(BackgroundJobRetryInputSchema, value) : validateInput(BackgroundJobCreateInputSchema, value);

  }
  const response = await forward(new Request(request.url, {
    method: request.method, signal: request.signal,
    headers: { accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }), endpoint);
  if (!response.ok) { return response; }
  if (!rawId && request.method === 'GET') {

    const page = BackgroundJobPageSchema.parse(await response.json());
    if (page.data.some((job) => job.userId !== userId)) { throw new OwnershipError(); }
    return Response.json(page, { headers });

  }
  const job = BackgroundJobSchema.parse(await response.json());
  if (job.userId !== userId || (rawId && job.id !== rawId)) { throw new OwnershipError(); }
  return Response.json(job, { status: response.status, headers });

}
