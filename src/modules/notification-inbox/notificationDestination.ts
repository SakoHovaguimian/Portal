import { portalModules } from '@/config/portalModules';

const supportedRoutes = new Set([
  'dashboard',
  'profile',
  'feature-requests',
  'chat',
  'settings',
  ...(portalModules.notifications ? ['notifications'] : []),
  ...(portalModules.accountTools ? ['help'] : []),
  ...(portalModules.publishing ? ['blog'] : []),
  ...(portalModules.engagement ? ['saved'] : []),
]);

/** Notification payloads cannot navigate to external origins, auth, or executable URLs. */
export function notificationDestination(destination: string | null) {

  if (
    !destination ||
    !destination.startsWith('/') ||
    destination.startsWith('//') ||
    /[\\\u0000-\u001f]/.test(destination)
  ) { return null; }
  try {

    const url = new URL(destination, 'https://portal.internal');
    if (
      url.origin !== 'https://portal.internal' ||
      !supportedRoutes.has(url.pathname.split('/')[1])
    ) { return null; }
    return `${url.pathname}${url.search}${url.hash}`;

  } catch {
    return null;
  }

}
