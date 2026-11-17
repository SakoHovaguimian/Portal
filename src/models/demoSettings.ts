import { z } from 'zod';

import { DemoContextSchema } from './demoContext';
import { UserRoleSchema } from './userRole';

export const DemoSettingsInputSchema = DemoContextSchema.extend({
  demoMode: z.boolean(),
}).strict();

export const DemoSettingsSchema = DemoSettingsInputSchema.extend({
  enabled: z.boolean(),
  role: UserRoleSchema,
});

export type DemoSettingsInput = z.infer<typeof DemoSettingsInputSchema>;

export type DemoSettings = z.infer<typeof DemoSettingsSchema>;
