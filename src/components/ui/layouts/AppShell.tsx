import { ProjectBrand } from '@/components/ProjectBrand';
import { strings } from '@/strings';

import { cn } from '../lib/cn';
import type { AppShellProps } from '../models/appShellProps';

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
  const activeItem = items.find((item) => item.active);
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
      <header className="ui-app-topbar top-0 z-30 shrink-0 border-b-control border-(--dashboard-shell-border) bg-(--dashboard-shell-topbar) lg:sticky">
        <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-2 px-(--space-page) py-2 lg:gap-5">
          <div className="flex min-w-0 items-center gap-2 lg:gap-4">
            <MobileNavigationMenu
              key={`${session.user.id}:${activePath}`}
              {...sidebar}
            />
            <ProjectBrand className="max-h-8 min-w-0 truncate text-sm font-semibold text-primary max-[23rem]:hidden lg:hidden" />
            <div className="hidden min-w-0 items-center gap-3 text-sm lg:flex">
              <span className="text-secondary">{strings.ui.appShell.workspace}</span>
              {activeItem && (
                <span className="truncate font-semibold text-primary lg:border-s-control lg:border-secondary lg:ps-3">
                  {activeItem.label}
                </span>
              )}
            </div>
          </div>
          {utilitySlot && (
            <div className="flex shrink-0 items-center gap-1 lg:gap-2">
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
