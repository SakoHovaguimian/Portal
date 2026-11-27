import { z } from 'zod';

export const cookieConsentVersion = 1;

export const CookieConsentRecordSchema = z.object({
  version: z.literal(cookieConsentVersion),
  choice: z.enum([
    'accepted',
    'declined',
  ]),
});
