import { UiIcon, type AppSidebarItem } from '@/components/ui';
import type { UserRole } from '@/models/userRole';
import { portalModuleStrings, strings } from '@/strings';

import type { ProjectRouting } from './models/projectRouting';
import { getProjectDestinationHref } from './projectRoutes';

export function portalNavigation(
  routing: ProjectRouting,
  role: UserRole,
  devSettingsEnabled?: boolean,
): AppSidebarItem[] {

  const items: AppSidebarItem[] = routing.navigation.map((item) => ({
    href: getProjectDestinationHref(item, role),
    label: item.label,
    icon: <UiIcon name={item.icon} />,
  }));
  if (devSettingsEnabled) {

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
