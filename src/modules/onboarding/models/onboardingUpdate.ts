import { z } from 'zod';
import { OnboardingProfileSchema } from './onboardingProfile';
import { OnboardingPreferencesSchema } from './onboardingPreferences';

export const OnboardingUpdateSchema = z.discriminatedUnion('step', [
  z
    .object({ step: z.literal('profile'), input: OnboardingProfileSchema })
    .strict(),
  z
    .object({
      step: z.literal('preferences'),
      input: OnboardingPreferencesSchema,
    })
    .strict(),
  z.object({ step: z.literal('review'), complete: z.literal(true) }).strict(),
]);

export type OnboardingUpdate = z.infer<typeof OnboardingUpdateSchema>;
