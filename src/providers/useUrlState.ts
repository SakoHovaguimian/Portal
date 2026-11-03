'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigationGuard } from './NavigationGuardProvider';

interface UrlStateOptions {
  /** Committed choices push by default; replace is for transient normalization. */
  replace?: boolean;
}

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
      if (!allowedValues.includes(next)) return;
      const url = new URL(window.location.href);
      if ((url.searchParams.get(key) ?? fallback) === next) return;
      if (!(await confirmNavigation())) return;
      if (next === fallback) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      const href = url.pathname + url.search + url.hash;
      if (options.replace) window.history.replaceState(null, '', href);
      else window.history.pushState(null, '', href);
    },
    [allowedValues, confirmNavigation, fallback, key],
  );
  return [value, setValue] as const;
}
