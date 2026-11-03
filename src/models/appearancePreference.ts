import { z } from 'zod';
import { ThemeModeSchema } from './themeMode';
import { ThemeIdSchema } from './themeId';
import { projectConfiguration } from '@/config/projectConfiguration';

export const AppearancePreferenceSchema = z.object({
  themeId: ThemeIdSchema.default(projectConfiguration.appearance.themeId),
  mode: ThemeModeSchema,
});

export type AppearancePreference = z.infer<typeof AppearancePreferenceSchema>;

export const defaultAppearancePreference: AppearancePreference = {
  ...projectConfiguration.appearance,
};
