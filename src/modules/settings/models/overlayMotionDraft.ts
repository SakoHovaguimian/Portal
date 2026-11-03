import type { PresentationMotionConfig } from '@/presentation/models/presentationMotionConfig';

export interface OverlayMotionDraft {
  durationMs?: number;
  scale?: number;
  travelPx?: number;
  easing?: PresentationMotionConfig['easing'];
}
