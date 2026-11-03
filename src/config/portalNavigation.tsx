import { UiIcon, type AppSidebarItem } from '@/components/ui';
import type { RuntimeConfig } from '@/models/runtimeConfig';
import type { SessionUser } from '@/models/sessionUser';
import { strings, portalModuleStrings } from '@/strings';
import { canManageContent } from '@/services/auth/permissions';
import { portalModules } from './portalModules';

export function portalNavigation(
  user: SessionUser,
  runtime: RuntimeConfig,
): AppSidebarItem[] {
  const items: AppSidebarItem[] = [
    {
      href: '/dashboard',
      label: strings.ui.appShell.dashboard,
      icon: <UiIcon name="grid" />,
    },
    {
      href: '/feature-requests',
      label: strings.ui.appShell.featureRequests,
      icon: <UiIcon name="file" />,
    },
    {
      href: '/chat',
      label: strings.ui.appShell.chat,
      icon: <UiIcon name="mail" />,
    },
    {
      href: '/users',
      label: strings.ui.appShell.users,
      icon: <UiIcon name="user" />,
    },
  ];
  if (portalModules.publishing)
    items.push({
      href: canManageContent(user.role) ? '/admin/blog' : '/blog',
      label: portalModuleStrings.publishing,
      icon: <UiIcon name="layers" />,
    });
  if (portalModules.notifications)
    items.push({
      href: '/notifications',
      label: portalModuleStrings.notifications,
      icon: <UiIcon name="bell" />,
    });
  if (portalModules.engagement)
    items.push({
      href: '/saved',
      label: portalModuleStrings.saved,
      icon: <UiIcon name="bookmark" />,
    });
  items.push(
    {
      href: '/profile',
      label: strings.ui.appShell.profile,
      icon: <UiIcon name="user" />,
    },
    {
      href: '/settings/appearance',
      label: strings.ui.appShell.appearance,
      icon: <UiIcon name="settings" />,
    },
  );
  if (portalModules.accountTools)
    items.push(
      {
        href: '/settings/account',
        label: portalModuleStrings.account,
        icon: <UiIcon name="lock" />,
      },
      {
        href: '/help',
        label: portalModuleStrings.help,
        icon: <UiIcon name="info" />,
      },
    );
  if (runtime.devSettingsEnabled)
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
  return items;
}
