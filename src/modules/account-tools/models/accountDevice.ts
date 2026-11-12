import { z } from 'zod';

import { AccountDeviceTypeSchema } from './accountDeviceType';

export { AccountDeviceTypeSchema } from './accountDeviceType';

export type { AccountDeviceType } from './accountDeviceType';

export const AccountDeviceSchema = z.object({
  id: z.string().uuid(),
  deviceType: AccountDeviceTypeSchema,
  createdAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime().nullable(),
});

export type AccountDevice = z.infer<typeof AccountDeviceSchema>;
