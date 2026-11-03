import { z } from 'zod';
import { ThemeModeSchema } from './themeMode';
import { ThemeIdSchema } from './themeId';
export const AppearancePreferenceSchema = z.object({
  themeId: ThemeIdSchema.default('portal'),
  mode: ThemeModeSchema,
});
export type AppearancePreference = z.infer<typeof AppearancePreferenceSchema>;
export const defaultAppearancePreference: AppearancePreference = {
  themeId: 'portal',
  mode: 'light',
};
