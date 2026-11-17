import { z } from 'zod';

export const AccountDeviceTypeSchema = z.enum([
  'iOS',
  'Android',
  'Web',
]);

export type AccountDeviceType = z.infer<typeof AccountDeviceTypeSchema>;
