import 'server-only';
import { ApiError, AuthError, DomainError } from '@/errors/domainErrors';
import type { BackendForward } from '@/services/api/models/backendForward';
import type { ServerSession } from '@/services/session/models/serverSession';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { portalOnboardingStrings as copy, strings } from '@/strings';
import { OnboardingProgressSchema } from '../models/onboardingProgress';
export function isOnboardingRecoveryApiPath(path: string, userId: string) {
  const pathname = new URL(path, 'http://portal.internal').pathname;
  return (
    pathname === '/onboarding' ||
    pathname === '/users/profile' ||
    pathname === `/users/${encodeURIComponent(userId)}` ||
    pathname === '/portal/account-tools' ||
    pathname.startsWith('/portal/account-tools/')
  );
}
export async function enforceLiveOnboarding(
  request: Request,
  path: string,
  session: ServerSession,
  forward: BackendForward,
) {
  const runtime = await getEffectiveRuntime();
  if (
    runtime.demoMode ||
    !runtime.onboardingEnabled ||
    isOnboardingRecoveryApiPath(path, session.user.id)
  )
    return;
  const response = await forward(
    new Request(request.url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: request.signal,
    }),
    '/onboarding',
  );
  if (response.status === 401)
    throw new AuthError(strings.errors.sessionExpired);
  if (!response.ok) throw new ApiError(strings.errors.unavailable, 503);
  const parsed = OnboardingProgressSchema.safeParse(
    await response.json().catch(() => null),
  );
  if (!parsed.success) throw new ApiError(strings.errors.unavailable, 503);
  if (!parsed.data.completedAt)
    throw new DomainError(copy.required, 'ONBOARDING_REQUIRED', 403);
}
