import type { Route } from 'next';

import type { UserRole } from '@/models/userRole';
import { canManageContent } from '@/services/auth/permissions';

import type { ProjectNavigationItem } from './models/projectNavigationItem';
import type { ProjectRouting } from './models/projectRouting';

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getProjectDestinationHref(item: ProjectNavigationItem, role?: UserRole) {
  return item.staffHref && role && canManageContent(role) ? item.staffHref : item.href;
}

export function getDefaultProjectRoute(routing: ProjectRouting, role?: UserRole): Route {

  const destination = routing.navigation[0];
  return destination ? getProjectDestinationHref(destination, role) : '/profile';

}

export function isProjectRedirectAllowed(routing: ProjectRouting, pathname: string) {

  const allowed = !routing.disabledPaths.includes(pathname) &&
    !routing.disabledPrefixes.some((prefix) => matchesPrefix(pathname, prefix)) &&
    routing.redirectPrefixes.some((prefix) => matchesPrefix(pathname, prefix));

  return allowed;

}
