import { z } from 'zod';

import { DemoScenarioSchema } from './demoScenario';

export const DemoContextSchema = z.object({
  scenario: DemoScenarioSchema.default('populated'),
  latencyMs: z.number().int().min(0).max(5000).default(0),
});

export type DemoContext = z.infer<typeof DemoContextSchema>;
