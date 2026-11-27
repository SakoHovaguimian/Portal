import type { AppearancePreference } from '@/models/appearancePreference';
import type { ThemeId } from '@/models/themeId';

export type ThemePreferenceContext = AppearancePreference & {
  ready: boolean;
  setPreference: (value: Partial<AppearancePreference>) => Promise<void>;
  setThemeId: (themeId: ThemeId) => Promise<void>;
};
