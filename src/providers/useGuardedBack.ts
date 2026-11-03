'use client';

import { useCallback } from 'react';
import { useNavigationGuard } from './NavigationGuardProvider';

/** Use an owning list/dashboard route as the direct-entry fallback. */
export function useGuardedBack(fallback: string) {

  const { back } = useNavigationGuard();
  const guardedBack = useCallback(() => back(fallback), [back, fallback]);
  return guardedBack;

}
