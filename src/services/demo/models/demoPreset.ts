import { z } from 'zod';
export const DemoPresetSchema = z.enum([
  'empty',
  'populated',
  'onboarding',
  'admin',
  'superadmin',
]);
export type DemoPreset = z.infer<typeof DemoPresetSchema>;
