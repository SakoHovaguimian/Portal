import type { PresentationMotionEasing } from './presentationMotionEasing';

export type PresentationMotionOverride = {
  enabled?: boolean;
  durationMs?: number;
  exitDurationMs?: number;
  scale?: number;
  travelPx?: number;
  easing?: PresentationMotionEasing;
};
