import { cn } from '../lib/cn';
import type { SkeletonProps } from '../models/skeletonProps';
import './ValueControls.css';

/** Decorative placeholder. The loading region owns aria-busy and its status label. */
export function Skeleton({
  shape = 'text',
  width,
  height,
  animated = true,
  className,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('ui-skeleton', className)}
      data-shape={shape}
      data-animated={animated || undefined}
      style={{ width, height }}
    />
  );
}
