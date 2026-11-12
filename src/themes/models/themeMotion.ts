import type { ThemeOverlayMotion } from './themeOverlayMotion';
import type { ThemeOverlayTarget } from './themeOverlayTarget';

export type ThemeMotion = {
  press: number;
  fast: number;
  base: number;
  enter: number;
  celebration: number;
  ease: string;
  spring: string;
  pressScale: number;
  hoverScale: number;
  enterScale: number;
  overlays?: Partial<Record<ThemeOverlayTarget, Partial<ThemeOverlayMotion>>>;
};
