import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { RedirectRouteProps } from '@/models/redirectRouteProps';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { portalOnboardingStrings } from '@/strings';

import { OnboardingScreen } from '@/modules/onboarding/OnboardingScreen';

export const metadata: Metadata = { title: portalOnboardingStrings.title };

export default async function OnboardingPage({
  searchParams,
}: RedirectRouteProps) {

  if (!(await getEffectiveRuntime()).onboardingEnabled) { notFound(); }
  const { redirectTo } = await searchParams;
  return <OnboardingScreen redirectTo={redirectTo} />;

}
