import { z } from 'zod';

export const ThemeIdSchema = z.enum([
  'portal',
  'studio',
  'atelier',
  'blueprint',
  'arcade',
  'dusk',
  'cupertino',
  'carbon',
]);

export type ThemeId = z.infer<typeof ThemeIdSchema>;
