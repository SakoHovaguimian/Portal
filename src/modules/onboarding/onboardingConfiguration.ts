import { portalOnboardingStrings as copy } from '@/strings';

import type { OnboardingStepDescriptor } from './models/onboardingStepDescriptor';

export const onboardingSteps: OnboardingStepDescriptor[] = [
  { key: 'profile', ...copy.steps.profile },
  { key: 'preferences', ...copy.steps.preferences },
  { key: 'review', ...copy.steps.review },
];

export const onboardingRecoveryPrefixes = [
  '/onboarding',
  '/dev-settings',
  '/profile',
  '/settings/account',
] as const;

export function isOnboardingRecoveryPath(path: string) {

  const isRecoveryPathPrefix = onboardingRecoveryPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  return isRecoveryPathPrefix;

}
