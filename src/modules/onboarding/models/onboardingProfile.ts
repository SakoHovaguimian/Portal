import { z } from 'zod';

import { portalOnboardingStrings as copy } from '@/strings';

export const OnboardingProfileSchema = z
  .object({
    firstName: z.string().trim().min(1, copy.invalidName).max(80),
    lastName: z.string().trim().min(1, copy.invalidName).max(80),
  })
  .strict();

export type OnboardingProfile = z.infer<typeof OnboardingProfileSchema>;
