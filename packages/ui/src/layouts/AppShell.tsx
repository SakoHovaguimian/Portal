import type { PropsWithChildren, ReactNode } from 'react';
import type { AppSession } from '@semantic-web/core';
import { cn } from '../lib/cn';

const nav: Array<{ href: string; label: string }> = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/feature-requests', label: 'Feature Requests' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings/appearance', label: 'Appearance' },
];

function isActivePath(activePath: string | undefined, href: string) {
  if (!activePath) {
    return false;
  }

  if (activePath === href) {
    return true;
  }

  if (href === '/settings/appearance') {
    return activePath.startsWith('/settings');
  }

  return activePath.startsWith(`${href}/`);
}

export function AppShell({
  children,
  session,
  utilitySlot,
  activePath,
  onNavigate,
}: PropsWithChildren<{
  session: AppSession;
  utilitySlot?: ReactNode;
  activePath?: string;
  onNavigate?: (href: string) => void;
}>) {
  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_20%_8%,color-mix(in_srgb,var(--color-brand-400)_10%,transparent),transparent_40%),linear-gradient(180deg,var(--color-bg-secondary_subtle),var(--color-bg-secondary))] lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border-b border-secondary/80 bg-primary/78 px-6 py-6 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0 lg:px-8">
        <div className="flex h-full flex-col gap-6">
          <div className="rounded-[1.75rem] border border-secondary/90 bg-primary/90 p-5 shadow-[0_14px_34px_rgba(16,31,30,0.12)]">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Semantic Web Framework</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary">
              {session.user.firstName} {session.user.lastName}
            </h1>
            <p className="mt-2 text-sm text-secondary">{session.user.email}</p>
          </div>
          <nav className="grid gap-2">
            {nav.map((item) => (
              onNavigate ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'bouncy-button rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
                    isActivePath(activePath, item.href)
                      ? 'border-brand bg-brand-primary/22 text-primary shadow-xs'
                      : 'border-transparent bg-secondary_subtle/75 text-secondary hover:border-secondary hover:bg-primary hover:text-primary',
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="bouncy-button rounded-2xl border border-transparent bg-secondary_subtle/75 px-4 py-3 text-sm font-medium text-secondary transition hover:border-secondary hover:bg-primary hover:text-primary"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>
          {utilitySlot ? (
            <div className="mt-auto rounded-[1.5rem] border border-secondary/90 bg-primary/90 p-4 shadow-[0_12px_30px_rgba(16,31,30,0.12)]">
              {utilitySlot}
            </div>
          ) : null}
        </div>
      </aside>
      <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
