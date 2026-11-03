'use client';

import { useCallback } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { internalNavigationHref } from './navigationHistory';
import { useNavigationGuard } from './NavigationGuardProvider';

// Client navigation that first asks the active form's leave guard.
// Pass it to PageHeader/Breadcrumbs `onNavigate` and guarded link handlers.
export function useGuardedNavigate() {

  const router = useRouter();
  const { confirmNavigation } = useNavigationGuard();
  const guardedNavigate = useCallback(
    async (href: string) => {

      const destination = internalNavigationHref(href);
      if (destination && (await confirmNavigation())) { router.push(destination as Route); }

    },
    [confirmNavigation, router],
  );

  return guardedNavigate;

}
