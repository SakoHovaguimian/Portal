import type { OnboardingStepDescriptor } from './models/onboardingStepDescriptor';
import { portalOnboardingStrings as copy } from '@/strings';
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
  return onboardingRecoveryPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
