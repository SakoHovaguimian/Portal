'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';

import { QueryBoundary, InlineLoading } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';

import { useOnboarding } from './hooks';
import type { OnboardingGateProps } from './models/onboardingGateProps';
import { isOnboardingRecoveryPath } from './onboardingConfiguration';

export function OnboardingGate({ children }: OnboardingGateProps) {

  const pathname = usePathname();
  const router = useRouter();
  const runtime = useRuntimeConfig();
  const enabled = runtime.onboardingEnabled ?? runtime.demoMode;
  const query = useOnboarding(enabled);
  const recovery = isOnboardingRecoveryPath(pathname);

  useEffect(() => {

    if (enabled && !recovery && query.data && !query.data.completedAt) {

      const target = window.location.pathname + window.location.search;
      router.replace(
        `/onboarding?redirectTo=${encodeURIComponent(target)}` as Route,
      );

    }

  }, [enabled, recovery, query.data, router]);

  if (!enabled || recovery) { return children; }
  return (
    <QueryBoundary query={query} loadingFallback={<InlineLoading />}>
      {(progress) => (progress.completedAt ? children : <InlineLoading />)}
    </QueryBoundary>
  );

}
