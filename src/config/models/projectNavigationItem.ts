import type { Route } from 'next';

import type { IconName } from '@/components/ui/models/iconName';

export interface ProjectNavigationItem {
  href: Route;
  staffHref?: Route;
  label: string;
  icon: IconName;
}
