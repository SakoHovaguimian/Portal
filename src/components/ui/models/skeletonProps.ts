import type { CSSProperties } from 'react';

export interface SkeletonProps {
  shape?: 'text' | 'rectangle' | 'circle';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  animated?: boolean;
  className?: string;
}
