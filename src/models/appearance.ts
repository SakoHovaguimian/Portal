import { z } from 'zod';

export const ThemeModeSchema = z.enum(['light', 'dark']);
export const AccentThemeSchema = z.enum([
  'aqua',
  'blue',
  'indigo',
  'mint',
  'salmon',
  'violet',
  'amber',
  'teal',
  'rose',
  'sky',
  'emerald',
  'seafoam',
  'coral',
  'sunset',
  'orchid',
]);

export const AppearancePreferenceSchema = z.object({
  mode: ThemeModeSchema,
  accent: AccentThemeSchema,
});

export type ThemeMode = z.infer<typeof ThemeModeSchema>;
export type AccentTheme = z.infer<typeof AccentThemeSchema>;
export type AppearancePreference = z.infer<typeof AppearancePreferenceSchema>;
export type ThemeTokens = {
  color: Record<string, string>;
  space: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
};
