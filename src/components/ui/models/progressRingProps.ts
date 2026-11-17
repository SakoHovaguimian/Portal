import type { ProgressBarProps } from './progressBarProps';

export interface ProgressRingProps extends ProgressBarProps {
  /** Keep a concise visible value inside the ring. */
  showValue?: boolean;
}
