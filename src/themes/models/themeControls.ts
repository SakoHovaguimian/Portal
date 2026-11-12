import type { ThemeMode } from '@/models/themeMode';

import type { ThemeControlColors } from './themeControlColors';

/** Optional component roles extend complete themes without changing existing presets. */
export type ThemeControls = {
  trackRadius: string;
  sliderThumbRadius: string;
  sliderThumbWidth: string;
  sliderThumbHeight: string;
  sliderTrackHeight: string;
  sliderVerticalLength: string;
  progressTrackHeight: string;
  progressRingStroke: string;
  switchTrackRadius?: string;
  switchThumbRadius?: string;
  switchWidth: string;
  switchHeight: string;
  switchInset: string;
  colors: Readonly<Record<ThemeMode, ThemeControlColors>>;
  shadow: Readonly<Record<ThemeMode, string>>;
};
