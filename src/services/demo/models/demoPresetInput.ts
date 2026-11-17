import { z } from 'zod';

import { DemoPresetSchema } from './demoPreset';

export const DemoPresetInputSchema = z.object({ preset: DemoPresetSchema }).strict();

export type DemoPresetInput = z.infer<typeof DemoPresetInputSchema>;
