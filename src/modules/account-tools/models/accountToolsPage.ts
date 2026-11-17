import { z } from 'zod';

import { AccountToolsPageMetadataSchema } from './accountToolsPageMetadata';

export { AccountToolsPageMetadataSchema } from './accountToolsPageMetadata';

export function accountToolsPageSchema<T extends z.ZodType>(item: T) {

  return z.object({
    data: z.array(item),
    page: AccountToolsPageMetadataSchema,
  });

}
