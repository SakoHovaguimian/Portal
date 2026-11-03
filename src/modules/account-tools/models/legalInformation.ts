import { z } from 'zod';
import { LegalItemSchema } from './legalItem';

export { LegalContextSchema } from './legalContext';

export type { LegalContext } from './legalContext';

export { LegalItemSchema } from './legalItem';

export type { LegalItem } from './legalItem';

export const LegalInformationSchema = z.object({
  illustrative: z.boolean(),
  items: z.array(LegalItemSchema),
});
