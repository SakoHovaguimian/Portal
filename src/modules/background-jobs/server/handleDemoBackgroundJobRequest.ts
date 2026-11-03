import 'server-only';
import { z } from 'zod';
import { AuthError, NotFoundError, ValidationError } from '@/errors/domainErrors';
import { validateInput } from '@/utils/validateInput';
import { portalJobStrings as copy } from '@/strings';
import { BackgroundJobCreateInputSchema } from '../models/backgroundJob';
import { BackgroundJobQuerySchema } from '../models/backgroundJobQuery';
import { BackgroundJobRetryInputSchema } from '../models/backgroundJobRetryInput';
import { cancelDemoJob, enqueueDemoJob, getDemoJob, listDemoJobs, retryDemoJob } from './demoJobQueue';

// **************************************
// MARK: - HANDLE DEMO BACKGROUND JOB REQUEST
// **************************************

export async function handleDemoBackgroundJobRequest(request: Request, path: string, userId: string | null, options: { empty?: boolean } = {}): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, feature, rawId, action, ...extra] = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (area !== 'portal' || feature !== 'jobs') { return null; }
  if (!userId) { throw new AuthError(); }
  if (extra.length || (action && action !== 'cancel' && action !== 'retry')) { throw new NotFoundError(copy.errors.unavailable); }

  // **************************************
  // MARK: - READ DEMO JOB INPUT
  // **************************************

  const input = async () => {

    try { return await request.json(); } catch { throw new ValidationError(copy.errors.invalidInput); }

  };
  const headers = { 'cache-control': 'no-store' };
  if (!rawId) {

    if (request.method === 'GET') {

      const query = validateInput(BackgroundJobQuerySchema, Object.fromEntries(url.searchParams));
      return Response.json(listDemoJobs(userId, query, options.empty), { headers });

    }
    if (request.method === 'POST') {

      const body = validateInput(BackgroundJobCreateInputSchema, await input());
      const job = enqueueDemoJob(userId, body);
      return Response.json(job, { status: 202, headers });

    }
    return new Response(null, { status: 405, headers: { ...headers, allow: 'GET, POST' } });

  }
  const id = validateInput(z.uuid(), rawId);
  if (!action && request.method === 'GET') { return Response.json(getDemoJob(userId, id), { headers }); }
  if (action === 'cancel' && request.method === 'POST') { return Response.json(cancelDemoJob(userId, id), { headers }); }
  if (action === 'retry' && request.method === 'POST') {

    const body = validateInput(BackgroundJobRetryInputSchema, await input());
    return Response.json(retryDemoJob(userId, id, body), { status: 202, headers });

  }
  return new Response(null, { status: 405, headers: { ...headers, allow: action ? 'POST' : 'GET' } });

}
