import type { CSSProperties } from 'react';

export interface ResolvedPresentationMotion {
  enabled: boolean;
  durationMs: number;
  exitDurationMs: number;
  style: CSSProperties;
}
