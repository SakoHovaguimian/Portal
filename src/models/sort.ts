import { z } from 'zod';

import { SortDirectionSchema } from './sortDirection';

export { SortDirectionSchema } from './sortDirection';

export type { SortDirection } from './sortDirection';

export const SortSchema = z.object({
  field: z.string(),
  direction: SortDirectionSchema.default('desc'),
});

export type Sort = z.infer<typeof SortSchema>;
