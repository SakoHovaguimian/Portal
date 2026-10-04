import 'server-only';
import { ZodError } from 'zod';
import { DomainError } from '@/errors/domainErrors';
import { strings } from '@/strings';
export function trustedMutation(request: Request): boolean {
  if (['GET', 'HEAD'].includes(request.method)) return true;
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  // Browsers send Origin for same-origin mutations; non-browser clients may omit it.
  return (
    !origin ||
    origin === new URL(process.env.PORTAL_APP_ORIGIN || request.url).origin
  );
}
export function errorResponse(error: unknown) {
  const status =
    error instanceof DomainError
      ? error.status
      : error instanceof ZodError || error instanceof SyntaxError
        ? 400
        : 503;
  const message =
    error instanceof DomainError && status < 500
      ? error.message
      : status === 400
        ? strings.errors.invalidInput
        : strings.errors.unavailable;
  return Response.json(
    { message },
    { status, headers: { 'cache-control': 'no-store' } },
  );
}
