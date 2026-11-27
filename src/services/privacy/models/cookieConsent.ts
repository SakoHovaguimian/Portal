import type { z } from 'zod';

import type { CookieConsentRecordSchema } from './cookieConsentRecord';

export type CookieConsent = z.infer<typeof CookieConsentRecordSchema>['choice'] | null;
