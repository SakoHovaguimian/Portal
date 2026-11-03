import type { AppearancePreference } from '@/models/appearancePreference';
import type { ThemeId } from '@/models/themeId';

export type ThemePreferenceContext = AppearancePreference & {
  setPreference: (value: Partial<AppearancePreference>) => Promise<void>;
  setThemeId: (themeId: ThemeId) => Promise<void>;
};
