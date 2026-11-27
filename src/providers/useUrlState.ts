'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import type { UrlStateOptions } from './models/urlStateOptions';
import { useNavigationGuard } from './NavigationGuardProvider';

/** Shareable client-owned tab/filter state that restores through Back/Forward. */
export function useUrlState<Key extends string>(
  key: string,
  fallback: Key,
  allowedValues: readonly Key[],
) {

  const params = useSearchParams();
  const { confirmNavigation } = useNavigationGuard();
  const raw = params.get(key);
  const value =
    allowedValues.find((candidate) => candidate === raw) ?? fallback;
  const setValue = useCallback(
    async (next: Key, options: UrlStateOptions = {}) => {

      if (!allowedValues.includes(next)) { return false; }
      const previous = window.location.href;
      const url = new URL(previous);
      const clearParams = options.clearParams ?? [];
      const resetsDependentState = clearParams.some((name) => url.searchParams.has(name));
      if ((url.searchParams.get(key) ?? fallback) === next && !resetsDependentState) { return true; }
      if (!(await confirmNavigation()) || window.location.href !== previous) { return false; }
      for (const name of clearParams) { url.searchParams.delete(name); }
      if (next === fallback) { url.searchParams.delete(key); } else { url.searchParams.set(key, next); }
      const href = url.pathname + url.search + url.hash;
      if (options.replace) { window.history.replaceState(null, '', href); } else { window.history.pushState(null, '', href); }
      return true;

    },
    [allowedValues, confirmNavigation, fallback, key],
  );
  return [value, setValue] as const;

}
