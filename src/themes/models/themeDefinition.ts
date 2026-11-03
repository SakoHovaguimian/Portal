import type { ThemeId } from '@/models/themeId';
import type { ThemeMode } from '@/models/themeMode';
import type { ThemeBackground } from './themeBackground';
import type { ThemeForeground } from './themeForeground';
import type { ThemePalette } from './themePalette';
import type { ThemeRadius } from './themeRadius';
import type { ThemeShadow } from './themeShadow';
import type { ThemeTypography } from './themeTypography';
import type { ThemeSpacing } from './themeSpacing';
import type { ThemeBorder } from './themeBorder';
import type { ThemeMotion } from './themeMotion';
import type { ThemeSelection } from './themeSelection';
import type { ThemeControls } from './themeControls';

/** A complete, loadable design system. Components never select preset-specific styles. */
export type ThemeDefinition = {
  id: ThemeId;
  backgrounds: Readonly<Record<ThemeMode, ThemeBackground>>;
  foregrounds: Readonly<Record<ThemeMode, ThemeForeground>>;
  palette: Readonly<Record<ThemeMode, ThemePalette>>;
  radius: ThemeRadius;
  shadow: Readonly<Record<ThemeMode, ThemeShadow>>;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  border: Readonly<Record<ThemeMode, ThemeBorder>>;
  motion: ThemeMotion;
  selection: Readonly<Record<ThemeMode, ThemeSelection>>;
  controls?: ThemeControls;
};
