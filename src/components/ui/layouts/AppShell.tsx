import { cn } from '../lib/cn';
import type { AppShellProps } from '../models/appShellProps';
import { strings } from '@/strings';

import { AppSidebar } from './AppSidebar';
import { MobileNavigationMenu } from './MobileNavigationMenu';

export function AppShell({
  children,
  session,
  homeHref,
  utilitySlot,
  accountSlot,
  bannerSlot,
  contextSlot,
  activePath,
  onNavigate,
  navigationItems,
  contentLayout = 'page',
}: AppShellProps) {

  const items = navigationItems.map((item) => ({
    ...item,
    active: activePath === item.href || activePath?.startsWith(`${item.href}/`),
  }));
  const sidebar = {
    session,
    homeHref,
    items,
    onNavigate,
    accountSlot,
    activePath,
    contextSlot,
  };

  function renderHeader() {

    return (
      <header className="ui-app-topbar top-0 z-30 shrink-0 border-b-control border-(--dashboard-shell-border) bg-(--dashboard-shell-topbar) backdrop-blur lg:sticky">
        <div className="mx-auto flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-(--space-page) py-3">
          <div className="flex min-w-0 items-center gap-3">
            <MobileNavigationMenu
              key={`${session.user.id}:${activePath}`}
              {...sidebar}
            />
            <p className="m-0 flex min-w-0 items-center gap-2 text-sm font-medium text-tertiary">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-brand-solid"
              />
              {strings.ui.appShell.workspace}
            </p>
          </div>
          {utilitySlot && (
            <div className="flex shrink-0 items-center gap-3">
              {utilitySlot}
            </div>
          )}
        </div>
        {bannerSlot && (
          <div className="mx-auto w-full px-(--space-page) pb-3 empty:hidden">
            {bannerSlot}
          </div>
        )}
      </header>
    );

  }

  return (
    <div className="ui-app-shell min-h-dvh bg-(--dashboard-shell-bg) lg:ps-(--dashboard-sidebar-width)">
      <a
        href="#main-content"
        className="fixed inset-s-4 top-4 z-50 -translate-y-24 rounded-control bg-primary px-4 py-3 text-sm text-primary shadow-(--shadow-overlay) focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-brand"
      >
        {strings.componentLibrary.skipToContent}
      </a>
      <AppSidebar {...sidebar} />
      <div className={cn('min-w-0', contentLayout === 'workspace' && 'flex h-dvh min-h-0 flex-col')}>
        {renderHeader()}
        <main
          id="main-content"
          tabIndex={-1}
          className={cn('mx-auto flex w-full min-w-0 flex-col gap-(--space-section) px-(--space-page) pt-(--space-section) pb-12 outline-none lg:pb-16', contentLayout === 'workspace' && 'min-h-0 flex-1 overflow-hidden py-(--space-page) lg:pb-(--space-page)')}
        >
          {children}
        </main>
      </div>
    </div>
  );

}
