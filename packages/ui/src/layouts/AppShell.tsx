import type { PropsWithChildren, ReactNode } from 'react';
import type { AppSession } from '@semantic-web/core';
import { cn } from '../lib/cn';

const nav: Array<{ href: string; label: string; icon: ReactNode }> = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 4.5h5.25v4.25H4zm6.75 0H16v7h-5.25zm-6.75 5.75h5.25V16H4zm6.75 2.5H16V16h-5.25z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/users',
    label: 'Users',
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.5 6a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/feature-requests',
    label: 'Feature Requests',
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M5 5.5h10M5 10h10M5 14.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.25 5.75c.95-.95 2.38-1.5 4.25-1.5s3.3.55 4.25 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/settings/appearance',
    label: 'Appearance',
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M10 3.5v2.25m0 8.5v2.25M5.4 5.4l1.6 1.6m6 6 1.6 1.6M3.5 10h2.25m8.5 0h2.25M5.4 14.6l1.6-1.6m6-6 1.6-1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
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
  const activeItem = nav.find((item) => isActivePath(activePath, item.href)) ?? nav[0];

  return (
    <div className="min-h-screen bg-[var(--dashboard-shell-bg)] lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <aside className="border-b border-[var(--dashboard-shell-border)] bg-[var(--dashboard-shell-panel)] px-4 py-5 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-brand-secondary shadow-[var(--dashboard-shell-shadow)]">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M10 3.5 15.5 6.75v6.5L10 16.5l-5.5-3.25v-6.5L10 3.5Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6.5v7m3.25-5.25L6.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-tertiary">Workspace</p>
              <p className="m-0 text-sm font-semibold text-primary">Semantic Web</p>
            </div>
          </div>
          <nav className="grid gap-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Pages</p>
            {nav.map((item) => (
              onNavigate ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'bouncy-button flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition',
                    isActivePath(activePath, item.href)
                      ? 'border-brand/60 bg-brand-primary text-primary shadow-[var(--dashboard-shell-shadow)]'
                      : 'border-transparent text-secondary hover:border-secondary hover:bg-primary hover:text-primary',
                  )}
                >
                  <span className={cn('inline-flex h-8 w-8 items-center justify-center rounded-lg', isActivePath(activePath, item.href) ? 'bg-white/70 text-brand-secondary dark:bg-white/8 dark:text-brand-secondary' : 'bg-secondary_subtle text-tertiary')}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="bouncy-button flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-medium text-secondary transition hover:border-secondary hover:bg-primary hover:text-primary"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary_subtle text-tertiary">{item.icon}</span>
                  {item.label}
                </a>
              )
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-secondary bg-primary p-4 shadow-[var(--dashboard-shell-shadow)]">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Signed in as</p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="mt-1 text-sm text-secondary">{session.user.email}</p>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-[var(--dashboard-shell-border)] bg-[var(--dashboard-shell-topbar)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Admin workspace</p>
              <h1 className="m-0 text-lg font-semibold text-primary">{activeItem.label}</h1>
            </div>
            {utilitySlot ? <div className="flex items-center gap-3">{utilitySlot}</div> : null}
          </div>
        </header>
        <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
