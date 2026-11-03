import { z } from 'zod';

export const LegalContextSchema = z.enum([
  'terms_of_service',
  'privacy_policy',
]);

export type LegalContext = z.infer<typeof LegalContextSchema>;
