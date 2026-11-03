import type { OnboardingProgress } from './onboardingProgress';

export interface OnboardingFormProps {
  progress: OnboardingProgress;
  redirectTo?: string;
}
