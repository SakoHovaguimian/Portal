import { z } from 'zod';
import { portalJobStrings as copy } from '@/strings';

export const BackgroundJobResultSchema = z.object({
  summary: z.string().max(2000),
  values: z.record(z.string().max(80), z.json()),
}).refine((value) => JSON.stringify(value).length <= 65536, { error: copy.errors.invalidResult });

export type BackgroundJobResult = z.infer<typeof BackgroundJobResultSchema>;
