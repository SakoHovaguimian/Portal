import type { NavigationHistoryEntry } from './models/navigationHistoryEntry';

const historyKey = '__portalNavigation';

export function readNavigationEntry(
  state: unknown,
): NavigationHistoryEntry | null {

  if (!state || typeof state !== 'object') { return null; }
  const entry = (state as Record<string, unknown>)[historyKey];
  if (!entry || typeof entry !== 'object') { return null; }
  const { session, index } = entry as NavigationHistoryEntry;
  return typeof session === 'string' &&
    Number.isSafeInteger(index) &&
    index >= 0
    ? { session, index }
    : null;

}

/** Add our namespace without dropping Next's router tree or foreign history data. */
export function withNavigationEntry(
  state: unknown,
  entry: NavigationHistoryEntry,
) {

  return {
    ...(state && typeof state === 'object' ? state : {}),
    [historyKey]: entry,
  };

}

export function internalNavigationHref(href: string): string | null {

  try {

    const url = new URL(href, window.location.href);
    if (
      url.origin !== window.location.origin ||
      !['https:', 'http:'].includes(url.protocol)
    ) { return null; }
    return url.pathname + url.search + url.hash;

  } catch {
    return null;
  }

}
