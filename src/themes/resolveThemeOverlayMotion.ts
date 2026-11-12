import type { ThemeMotion } from './models/themeMotion';
import type { ThemeOverlayMotion } from './models/themeOverlayMotion';
import type { ThemeOverlayTarget } from './models/themeOverlayTarget';

// Older theme objects inherit their existing timing and restrained geometry.
export function resolveThemeOverlayMotion(motion: ThemeMotion, target: ThemeOverlayTarget): ThemeOverlayMotion {

  const profile = motion.overlays?.[target];
  const duration = profile?.duration ?? motion.enter;
  return {
    duration,
    exitDuration: profile?.exitDuration ?? Math.min(duration, motion.fast),
    scale: profile?.scale ?? motion.enterScale,
    travel: profile?.travel ?? (target === 'toast' || target === 'sheet' || target === 'menu' ? 24 : 12),
    easing: profile?.easing ?? motion.ease,
  };

}
