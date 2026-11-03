import { z } from 'zod';
import { parseDate } from '@internationalized/date';
import { strings, portalEditStrings } from '@/strings';
export const ProfileDraftSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, strings.auth.name)
    .max(80, portalEditStrings.nameTooLong),
  lastName: z
    .string()
    .trim()
    .min(1, strings.auth.name)
    .max(80, portalEditStrings.nameTooLong),
  phoneNumber: z.string(),
  dateOfBirth: z.string().refine((value) => {
    if (!value) return true;
    try {
      return parseDate(value).toString() === value;
    } catch {
      return false;
    }
  }, portalEditStrings.invalidDate),
});
export type ProfileDraft = z.infer<typeof ProfileDraftSchema>;
export type ProfileDraftErrors = Partial<Record<keyof ProfileDraft, string>>;
