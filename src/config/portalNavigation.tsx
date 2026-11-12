import { UiIcon, type AppSidebarItem } from '@/components/ui';
import type { RuntimeConfig } from '@/models/runtimeConfig';
import type { SessionUser } from '@/models/sessionUser';
import { canManageContent } from '@/services/auth/permissions';
import { strings, portalModuleStrings, portalJobStrings } from '@/strings';

import type { ProjectConfiguration } from './models/projectConfiguration';
import { projectConfiguration } from './projectConfiguration';
import { isProjectDestinationEnabled } from './projectRoutes';

export function portalNavigation(
  user: SessionUser,
  runtime: RuntimeConfig,
): AppSidebarItem[] {

  const destinations: Record<ProjectConfiguration['navigation'][number], AppSidebarItem> = {
    dashboard: { href: '/dashboard', label: strings.ui.appShell.dashboard, icon: <UiIcon name="grid" /> },
    featureRequests: { href: '/feature-requests', label: strings.ui.appShell.featureRequests, icon: <UiIcon name="file" /> },
    chat: { href: '/chat', label: strings.ui.appShell.chat, icon: <UiIcon name="mail" /> },
    users: { href: '/users', label: strings.ui.appShell.users, icon: <UiIcon name="user" /> },
    backgroundJobs: { href: '/jobs', label: portalJobStrings.title, icon: <UiIcon name="clock" /> },
    publishing: {
      href: canManageContent(user.role) ? '/admin/blog' : '/blog',
      label: portalModuleStrings.publishing,
      icon: <UiIcon name="layers" />,
    },
    notifications: { href: '/notifications', label: portalModuleStrings.notifications, icon: <UiIcon name="bell" /> },
    saved: { href: '/saved', label: portalModuleStrings.saved, icon: <UiIcon name="bookmark" /> },
    profile: { href: '/profile', label: strings.ui.appShell.profile, icon: <UiIcon name="user" /> },
    appearance: { href: '/settings/appearance', label: strings.ui.appShell.appearance, icon: <UiIcon name="settings" /> },
    account: { href: '/settings/account', label: portalModuleStrings.account, icon: <UiIcon name="lock" /> },
    help: { href: '/help', label: portalModuleStrings.help, icon: <UiIcon name="info" /> },
  };
  const items = projectConfiguration.navigation
    .filter(isProjectDestinationEnabled)
    .map((destination) => destinations[destination]);
  if (runtime.devSettingsEnabled) {

    items.push(
      {
        href: '/dev-settings',
        label: portalModuleStrings.demo,
        icon: <UiIcon name="flask" />,
        placement: 'bottom',
      },
      {
        href: '/dev-settings/components',
        label: strings.componentLibrary.title,
        icon: <UiIcon name="code" />,
        placement: 'bottom',
      },
    );

  }
  return items;

}
