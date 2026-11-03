import 'server-only';
import { NotFoundError } from '@/errors/domainErrors';
import { portalModules } from '@/config/portalModules';

// **************************************
// MARK: - REQUIRE MODULE AVAILABILITY
// **************************************

export function requireModuleAvailability(path: string, currentUserId?: string) {

  const pathname = new URL(path, 'http://portal.internal').pathname;
  if (
    (!portalModules.dashboard && /^\/dashboard(?:\/|$)/.test(pathname)) ||
    (!portalModules.featureRequests && /^\/feature-requests(?:\/|$)/.test(pathname)) ||
    (!portalModules.chat && /^\/chat(?:\/|$)/.test(pathname)) ||
    (!portalModules.backgroundJobs && /^\/(?:portal\/)?jobs(?:\/|$)/.test(pathname)) ||
    (!portalModules.users && /^\/users(?:\/|$)/.test(pathname) &&
      pathname !== '/users/profile' && pathname !== `/users/${encodeURIComponent(currentUserId ?? '')}`) ||
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
  ) { throw new NotFoundError(); }

}
