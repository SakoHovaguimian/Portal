import { z } from 'zod';

import { projectConfiguration } from '@/config/projectConfiguration';

import { ThemeIdSchema } from './themeId';
import { ThemeModeSchema } from './themeMode';

export const AppearancePreferenceSchema = z.object({
  themeId: ThemeIdSchema.default(projectConfiguration.appearance.themeId),
  mode: ThemeModeSchema,
});

export type AppearancePreference = z.infer<typeof AppearancePreferenceSchema>;

export const defaultAppearancePreference: AppearancePreference = {
  ...projectConfiguration.appearance,
};
