import { z } from 'zod';

export const PresentationMotionEasingSchema = z.enum([
  'smooth',
  'spring',
  'snappy',
]);

export type PresentationMotionEasing = z.infer<typeof PresentationMotionEasingSchema>;
