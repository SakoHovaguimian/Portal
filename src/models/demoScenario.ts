import { z } from 'zod';

export const DemoScenarioSchema = z.enum([
  'populated',
  'loading',
  'empty',
  'error',
]);

export type DemoScenario = z.infer<typeof DemoScenarioSchema>;
