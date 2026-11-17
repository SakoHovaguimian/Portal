import { z } from 'zod';

import { LegalContextSchema } from './legalContext';

export const LegalInformationQuerySchema = z.object({
  context: LegalContextSchema,
}).strict();

export type LegalInformationQuery = z.infer<typeof LegalInformationQuerySchema>;
