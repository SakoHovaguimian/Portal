const staticScreens = new Set([
  '/',
  '/admin/blog',
  '/admin/blog/new',
  '/blog',
  '/chat',
  '/dashboard',
  '/dev-settings',
  '/dev-settings/components',
  '/experience',
  '/feature-requests',
  '/help',
  '/jobs',
  '/login',
  '/notifications',
  '/onboarding',
  '/profile',
  '/saved',
  '/settings/account',
  '/settings/appearance',
  '/settings/delivery-history',
  '/settings/devices',
  '/settings/notifications',
  '/signup',
  '/users',
]);

const detailScreens = new Map([
  ['/admin/blog', '/admin/blog/:id'],
  ['/blog', '/blog/:slug'],
  ['/feature-requests', '/feature-requests/:id'],
  ['/jobs', '/jobs/:jobId'],
  ['/users', '/users/:id'],
]);

// **************************************
// MARK: - RESOLVE ANALYTICS SCREEN
// **************************************

export function getAnalyticsScreen(pathname: string): string | undefined {

  if (staticScreens.has(pathname)) { return pathname; }
  const separator = pathname.lastIndexOf('/');
  if (separator < 1 || separator === pathname.length - 1) { return undefined; }
  return detailScreens.get(pathname.slice(0, separator));

}
