import { z } from 'zod';
export const OnboardingStepSchema = z.enum([
  'profile',
  'preferences',
  'review',
]);
export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;
