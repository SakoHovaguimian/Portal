import { z } from 'zod';

export const BlogCoverPresetSchema = z.enum([
  'none',
]);

export type BlogCoverPreset = z.infer<typeof BlogCoverPresetSchema>;
