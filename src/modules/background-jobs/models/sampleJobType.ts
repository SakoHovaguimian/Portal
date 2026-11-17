import { z } from 'zod';

export const SampleJobTypeSchema = z.enum([
  'sample-report',
  'sample-export',
]);

export type SampleJobType = z.infer<typeof SampleJobTypeSchema>;

export const sampleJobTypes = {
  report: SampleJobTypeSchema.options[0],
  export: SampleJobTypeSchema.options[1],
};
