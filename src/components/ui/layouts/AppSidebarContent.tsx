'use client';

import type { AppSidebarContentProps } from '../models/appSidebarContentProps';
import { strings } from '@/strings';
import { NavigationLink } from '../components/NavigationLink';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { SidebarLinks } from '../components/SidebarLinks';
import { cn } from '../lib/cn';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { ProjectBrand } from '@/components/ProjectBrand';

export function AppSidebarContent({
  session,
  items,
  onNavigate,
  accountSlot,
  activePath,
  contextSlot,
  headerAction,
}: AppSidebarContentProps) {

  const homeHref = getDefaultProjectRoute(session.user.role);
  const displayName =
    `${session.user.firstName} ${session.user.lastName}`.trim();
  const primaryItems = items.filter((item) => item.placement !== 'bottom');
  const utilityItems = items.filter((item) => item.placement === 'bottom');

  function renderNavigation() {

    function renderBrand() {

      return (
        <div
          className={cn(
            'flex items-center justify-between gap-3 px-8',
            headerAction &&
              'sticky top-0 z-10 bg-(--dashboard-shell-panel-solid)',
          )}
        >
          <NavigationLink
            href={homeHref}
            className="inline-flex min-h-(--control-height-md) cursor-pointer items-center font-display text-2xl font-semibold tracking-tight text-brand-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
            navigate={onNavigate}
          >
            <ProjectBrand />
          </NavigationLink>
          {headerAction}
        </div>
      );

    }

    function renderLinks() {

      return (
        <nav
          aria-label={strings.ui.appShell.navigation}
          className="mx-4 flex flex-1 flex-col gap-2"
        >
          <SidebarLinks items={primaryItems} onNavigate={onNavigate} />
          {contextSlot && <div className="w-full min-w-0">{contextSlot}</div>}
          {utilityItems.length > 0 && (
            <div className="mt-auto grid gap-2 pt-4">
              <SidebarLinks items={utilityItems} onNavigate={onNavigate} />
            </div>
          )}
        </nav>
      );

    }

    return (
      <div className="flex flex-1 flex-col items-stretch gap-8 pt-10 pb-6">
        {renderBrand()}
        {renderLinks()}
      </div>
    );

  }

  function renderAccount() {

    return (
      <div className="mt-auto border-t-control border-secondary px-8 pt-3 pb-6">
        <NavigationLink
          href="/profile"
          navigate={onNavigate}
          className="ui-button inline-flex min-h-(--control-height-md) cursor-pointer items-center gap-2 rounded-control hover:bg-brand-primary focus-visible:outline-2 focus-visible:outline-brand -mx-4 h-auto w-[calc(100%+2rem)] min-w-0 justify-start px-4 py-3 text-left whitespace-nowrap"
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
        {accountSlot && <div className="mt-3">{accountSlot}</div>}
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
