'use client';

import type { Route } from 'next';

import type { ProjectRouting } from '@/config/models/projectRouting';
import { getDefaultProjectRoute, isProjectRedirectAllowed } from '@/config/projectRoutes';
import type { UserRole } from '@/models/userRole';
import { strings } from '@/strings';

import type { AuthSessionCreationResponse } from './models/authSessionCreationResponse';
import type { AuthSessionErrorResponse } from './models/authSessionErrorResponse';

// **************************************
// MARK: - CREATE AUTH SESSION
// **************************************

export async function createSession(body: Record<string, unknown>) {

  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {

    const payload = (await response.json().catch(() => null)) as AuthSessionErrorResponse | null;
    throw new Error(
      payload?.message ?? strings.ui.sessionClient.unableToEstablishSession,
    );

  }
  return (await response.json()) as AuthSessionCreationResponse;

}

// **************************************
// MARK: - RESOLVE AUTH REDIRECT
// **************************************

export function resolveAuthRedirect(routing: ProjectRouting, redirectTo?: string, role?: UserRole): Route {

  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//') ||
    redirectTo.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(redirectTo)
  ) { return getDefaultProjectRoute(routing, role); }
  try {

    const target = new URL(redirectTo, 'http://portal.internal');
    const isAllowedRedirect =
      target.origin === 'http://portal.internal' &&
      isProjectRedirectAllowed(routing, target.pathname);
    if (isAllowedRedirect) {
      return `${target.pathname}${target.search}${target.hash}` as Route;
    }

  } catch {
    /* Invalid destinations use the default workspace. */
  }
  return getDefaultProjectRoute(routing, role);

}

// **************************************
// MARK: - RESOLVE ONBOARDING REDIRECT
// **************************************

export function resolveOnboardingRedirect(routing: ProjectRouting, redirectTo?: string): Route {

  let target = resolveAuthRedirect(routing, redirectTo);
  if (new URL(target, 'http://portal.internal').pathname === '/onboarding') {

    target = resolveAuthRedirect(
      routing,
      new URL(target, 'http://portal.internal').searchParams.get(
        'redirectTo',
      ) ?? undefined,
    );
    if (new URL(target, 'http://portal.internal').pathname === '/onboarding') { return getDefaultProjectRoute(routing); }

  }
  return target;

}

// **************************************
// MARK: - RESOLVE SESSION REDIRECT
// **************************************

export function resolveSessionRedirect(
  routing: ProjectRouting,
  redirectTo: string | undefined,
  onboardingRequired = false,
  role?: UserRole,
): Route {

  const target = resolveAuthRedirect(routing, redirectTo, role);
  return onboardingRequired
    ? (`/onboarding?redirectTo=${encodeURIComponent(resolveOnboardingRedirect(routing, target))}` as Route)
    : target;

}
