import { z } from 'zod';

import { AccountDeviceTypeSchema } from './accountDeviceType';
import { AccountToolsPagingSchema } from './accountToolsPaging';

export const AccountDeviceQuerySchema = AccountToolsPagingSchema.extend({
  query: z.string().trim().max(500).default(''),
  deviceType: AccountDeviceTypeSchema.optional(),
}).strict();

export type AccountDeviceQuery = z.infer<typeof AccountDeviceQuerySchema>;
