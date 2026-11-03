import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OnboardingScreen } from '@/modules/onboarding/OnboardingScreen';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { portalOnboardingStrings } from '@/strings';
export const metadata: Metadata = { title: portalOnboardingStrings.title };
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  if (!(await getEffectiveRuntime()).onboardingEnabled) notFound();
  const { redirectTo } = await searchParams;
  return <OnboardingScreen redirectTo={redirectTo} />;
}
