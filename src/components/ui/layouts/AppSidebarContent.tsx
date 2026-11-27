'use client';

import { ProjectBrand } from '@/components/ProjectBrand';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { NavigationLink } from '../components/NavigationLink';
import { SidebarLinks } from '../components/SidebarLinks';
import { cn } from '../lib/cn';
import type { AppSidebarContentProps } from '../models/appSidebarContentProps';
import { strings } from '@/strings';

export function AppSidebarContent({
  session,
  homeHref,
  items,
  onNavigate,
  accountSlot,
  activePath,
  contextSlot,
  headerAction,
}: AppSidebarContentProps) {

  const displayName =
    `${session.user.firstName} ${session.user.lastName}`.trim();
  const primaryItems = items.filter((item) => item.placement !== 'bottom');
  const utilityItems = items.filter((item) => item.placement === 'bottom');

  function renderNavigation() {

    function renderBrand() {

      return (
        <div
          className={cn(
            'flex min-h-16 items-center justify-between gap-3 border-b-control border-(--dashboard-shell-border) px-5',
            headerAction &&
              'sticky top-0 z-10 bg-(--dashboard-shell-panel-solid)',
          )}
        >
          <NavigationLink
            href={homeHref}
            className="inline-flex min-h-(--control-height-md) min-w-0 cursor-pointer items-center rounded-control font-display text-xl font-semibold tracking-tight text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
            navigate={onNavigate}
          >
            <ProjectBrand showMark />
          </NavigationLink>
          {headerAction}
        </div>
      );

    }

    function renderLinks() {

      return (
        <nav
          aria-label={strings.ui.appShell.navigation}
          className="mx-3 flex flex-1 flex-col gap-0.5 px-1"
        >
          <SidebarLinks items={primaryItems} onNavigate={onNavigate} />
          {contextSlot && <div className="w-full min-w-0">{contextSlot}</div>}
          {utilityItems.length > 0 && (
            <div className="mt-auto grid gap-1 pt-6">
              <SidebarLinks items={utilityItems} onNavigate={onNavigate} />
            </div>
          )}
        </nav>
      );

    }

    return (
      <div className="flex flex-1 flex-col items-stretch gap-4 pb-4">
        {renderBrand()}
        {renderLinks()}
      </div>
    );

  }

  function renderAccount() {

    return (
      <div className="mt-auto border-t-control border-(--dashboard-shell-border) px-5 py-3">
        <NavigationLink
          href="/profile"
          navigate={onNavigate}
          className="ui-button -mx-2 inline-flex h-auto min-h-(--control-height-md) w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center justify-start gap-2 rounded-control px-2 py-2 text-left whitespace-nowrap hover:bg-brand-primary focus-visible:outline-2 focus-visible:outline-brand"
          aria-label={strings.designSystem.profileLink}
          aria-current={activePath === '/profile' ? 'page' : undefined}
        >
          <InitialsAvatar name={displayName} />
          <span className="grid min-w-0 flex-1 gap-0.5">
            <span
              className="block min-w-0 truncate text-sm font-semibold text-primary"
              title={displayName}
            >
              {displayName}
            </span>
            <span
              className="block min-w-0 truncate text-xs text-secondary"
              title={session.user.email}
            >
              {session.user.email}
            </span>
          </span>
        </NavigationLink>
        {accountSlot && <div className="mt-2">{accountSlot}</div>}
      </div>
    );

  }

  return (
    <div className="flex min-h-full flex-col">
      {renderNavigation()}
      {renderAccount()}
    </div>
  );

}
