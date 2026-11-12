'use client';

import type { Route } from 'next';

import { getDefaultProjectRoute, isProjectPathEnabled } from '@/config/projectRoutes';
import type { UserRole } from '@/models/userRole';
import { strings } from '@/strings';

import type { AuthSessionCreationResponse } from './models/authSessionCreationResponse';
import type { AuthSessionErrorResponse } from './models/authSessionErrorResponse';

const allowedRedirectPrefixes = [
  '/dashboard',
  '/users',
  '/feature-requests',
  '/settings',
  '/profile',
  '/experience',
  '/dev-settings',
  '/chat',
  '/jobs',
  '/blog',
  '/onboarding',
  '/admin',
  '/superadmin',
  '/notifications',
  '/settings/account',
  '/saved',
  '/help',
] as const;

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

export function resolveAuthRedirect(redirectTo?: string, role?: UserRole): Route {

  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//') ||
    redirectTo.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(redirectTo)
  ) { return getDefaultProjectRoute(role); }
  try {

    const target = new URL(redirectTo, 'http://portal.internal');
    const isAllowedRedirect =
      target.origin === 'http://portal.internal' &&
      isProjectPathEnabled(target.pathname) &&
      allowedRedirectPrefixes.some(
        (prefix) =>
          target.pathname === prefix ||
          target.pathname.startsWith(`${prefix}/`),
      );
    if (isAllowedRedirect) {
      return `${target.pathname}${target.search}${target.hash}` as Route;
    }

  } catch {
    /* Invalid destinations use the default workspace. */
  }
  return getDefaultProjectRoute(role);

}

// **************************************
// MARK: - RESOLVE ONBOARDING REDIRECT
// **************************************

export function resolveOnboardingRedirect(redirectTo?: string): Route {

  let target = resolveAuthRedirect(redirectTo);
  if (new URL(target, 'http://portal.internal').pathname === '/onboarding') {

    target = resolveAuthRedirect(
      new URL(target, 'http://portal.internal').searchParams.get(
        'redirectTo',
      ) ?? undefined,
    );
    if (new URL(target, 'http://portal.internal').pathname === '/onboarding') { return getDefaultProjectRoute(); }

  }
  return target;

}

// **************************************
// MARK: - RESOLVE SESSION REDIRECT
// **************************************

export function resolveSessionRedirect(
  redirectTo: string | undefined,
  onboardingRequired = false,
  role?: UserRole,
): Route {

  const target = resolveAuthRedirect(redirectTo, role);
  return onboardingRequired
    ? (`/onboarding?redirectTo=${encodeURIComponent(resolveOnboardingRedirect(target))}` as Route)
    : target;

}
