import type { CSSProperties } from 'react';

export interface OverlayMotionProps {
  motionEnabled?: boolean;
  motionDurationMs?: number;
  motionExitDurationMs?: number;
  motionStyle?: CSSProperties;
}
