import { z } from 'zod';

export const DevSettingsUpdateResultSchema = z.object({
  reload: z.boolean(),
});

export type DevSettingsUpdateResult = z.infer<typeof DevSettingsUpdateResultSchema>;
