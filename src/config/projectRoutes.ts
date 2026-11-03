import type { Route } from 'next';
import type { ProjectConfiguration } from './models/projectConfiguration';
import { projectConfiguration } from './projectConfiguration';
import { portalModules } from './portalModules';
import type { UserRole } from '@/models/userRole';
import { canManageContent } from '@/services/auth/permissions';

export const projectNavigationRoutes = {
  dashboard: '/dashboard',
  users: '/users',
  featureRequests: '/feature-requests',
  chat: '/chat',
  backgroundJobs: '/jobs',
  publishing: '/blog',
  notifications: '/notifications',
  saved: '/saved',
  profile: '/profile',
  appearance: '/settings/appearance',
  account: '/settings/account',
  help: '/help',
} as const;

const capabilities: Partial<Record<
  ProjectConfiguration['navigation'][number],
  keyof ProjectConfiguration['modules']
>> = {
  dashboard: 'dashboard',
  users: 'users',
  featureRequests: 'featureRequests',
  chat: 'chat',
  backgroundJobs: 'backgroundJobs',
  publishing: 'publishing',
  notifications: 'notifications',
  saved: 'engagement',
  account: 'accountTools',
  help: 'accountTools',
};

export function isProjectDestinationEnabled(
  destination: ProjectConfiguration['navigation'][number],
) {

  const capability = capabilities[destination];
  return !capability || portalModules[capability];

}

export function getDefaultProjectRoute(role?: UserRole): Route {

  const destination = projectConfiguration.navigation.find(
    isProjectDestinationEnabled,
  );
  if (destination === 'publishing' && role && canManageContent(role)) { return '/admin/blog'; }
  return destination ? projectNavigationRoutes[destination] : '/profile';

}

export function isProjectPathEnabled(pathname: string) {

  const destination = Object.entries(projectNavigationRoutes).find(
    ([, route]) => pathname === route || pathname.startsWith(`${route}/`),
  )?.[0] as ProjectConfiguration['navigation'][number] | undefined;
  if (destination && !isProjectDestinationEnabled(destination)) { return false; }
  if (pathname.startsWith('/admin/blog') && !portalModules.publishing) { return false; }
  if (pathname === '/onboarding' && !portalModules.onboarding) { return false; }
  if (pathname === '/settings/notifications' && !portalModules.notifications) { return false; }
  if (['/settings/devices', '/settings/delivery-history'].includes(pathname) && !portalModules.accountTools) { return false; }
  return true;

}
