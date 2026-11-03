import 'server-only';
import { NotFoundError } from '@/errors/domainErrors';
import { portalModules } from '@/config/portalModules';

export function requireModuleAvailability(path: string) {
  const pathname = new URL(path, 'http://portal.internal').pathname;
  if (
    (!portalModules.publishing &&
      /^\/(?:public\/)?blog(?:\/|$)/.test(pathname)) ||
    (!portalModules.media && (/^\/media(?:\/|$)/.test(pathname) || pathname === '/blog/media/upload')) ||
    (!portalModules.notifications &&
      /^\/(?:portal\/notification-inbox|notifications)(?:\/|$)/.test(
        pathname,
      )) ||
    (!portalModules.accountTools &&
      /^\/(?:portal|admin)\/account-tools(?:\/|$)/.test(pathname)) ||
    (!portalModules.onboarding && /^\/onboarding(?:\/|$)/.test(pathname)) ||
    (!portalModules.engagement && /^\/engagement(?:\/|$)/.test(pathname))
  )
    throw new NotFoundError();
}
