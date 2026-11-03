import { z } from 'zod';
import { OnboardingStepSchema } from './onboardingStep';
import { OnboardingProfileSchema } from './onboardingProfile';
import { OnboardingPreferencesSchema } from './onboardingPreferences';
export const OnboardingProgressSchema = z.object({
  currentStep: OnboardingStepSchema,
  completedSteps: z.array(OnboardingStepSchema),
  profile: OnboardingProfileSchema,
  preferences: OnboardingPreferencesSchema,
  completedAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
});
export type OnboardingProgress = z.infer<typeof OnboardingProgressSchema>;
