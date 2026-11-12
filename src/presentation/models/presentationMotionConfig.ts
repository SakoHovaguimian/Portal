import { z } from 'zod';

import { PresentationMotionEasingSchema } from './presentationMotionEasing';

export const PresentationMotionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  toastDurationMs: z.number().min(0).max(1000).optional(),
  alertDurationMs: z.number().min(0).max(1000).optional(),
  sheetDurationMs: z.number().min(0).max(1000).optional(),
  scale: z.number().min(0.88).max(1).optional(),
  travelPx: z.number().min(0).max(64).optional(),
  easing: PresentationMotionEasingSchema.optional(),
}).strict();

export type PresentationMotionConfig = z.infer<typeof PresentationMotionConfigSchema>;

export const defaultPresentationMotionConfig: PresentationMotionConfig = { enabled: true };
