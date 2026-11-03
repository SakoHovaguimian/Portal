'use client';

import { strings } from '@/strings';
import type { Route } from 'next';

const allowedRedirectPrefixes = [
  '/dashboard',
  '/users',
  '/feature-requests',
  '/settings',
  '/profile',
  '/experience',
  '/dev-settings',
  '/chat',
  '/blog',
  '/onboarding',
  '/admin',
  '/superadmin',
  '/notifications',
  '/settings/account',
  '/saved',
  '/help',
] as const;

export async function createSession(body: Record<string, unknown>) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      payload?.message ?? strings.ui.sessionClient.unableToEstablishSession,
    );
  }
  return (await response.json()) as { onboardingRequired?: boolean };
}

export function resolveAuthRedirect(redirectTo?: string): Route {
  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//') ||
    redirectTo.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(redirectTo)
  )
    return '/dashboard';
  try {
    const target = new URL(redirectTo, 'http://portal.internal');
    if (
      target.origin === 'http://portal.internal' &&
      allowedRedirectPrefixes.some(
        (prefix) =>
          target.pathname === prefix ||
          target.pathname.startsWith(`${prefix}/`),
      )
    )
      return `${target.pathname}${target.search}${target.hash}` as Route;
  } catch {
    /* Invalid destinations use the default workspace. */
  }
  return '/dashboard';
}

export function resolveOnboardingRedirect(redirectTo?: string): Route {
  let target = resolveAuthRedirect(redirectTo);
  if (new URL(target, 'http://portal.internal').pathname === '/onboarding') {
    target = resolveAuthRedirect(
      new URL(target, 'http://portal.internal').searchParams.get(
        'redirectTo',
      ) ?? undefined,
    );
    if (new URL(target, 'http://portal.internal').pathname === '/onboarding')
      return '/dashboard';
  }
  return target;
}

export function resolveSessionRedirect(
  redirectTo: string | undefined,
  onboardingRequired = false,
): Route {
  const target = resolveAuthRedirect(redirectTo);
  return onboardingRequired
    ? (`/onboarding?redirectTo=${encodeURIComponent(resolveOnboardingRedirect(target))}` as Route)
    : target;
}
