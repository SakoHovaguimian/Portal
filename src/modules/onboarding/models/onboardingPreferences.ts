import { z } from 'zod';
import { portalOnboardingStrings as copy } from '@/strings';
export const OnboardingPreferencesSchema = z
  .object({
    timezone: z
      .string()
      .min(1)
      .max(100)
      .refine((value) => {
        try {
          new Intl.DateTimeFormat('en-US', { timeZone: value });
          return true;
        } catch {
          return false;
        }
      }, copy.invalidTimezone),
    emailDigest: z.boolean(),
  })
  .strict();
export type OnboardingPreferences = z.infer<typeof OnboardingPreferencesSchema>;
