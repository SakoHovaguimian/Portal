import type { SegmentedPanel } from './segmentedPanel';

export interface SegmentedPanelsProps<T extends string> {
  panels: Array<SegmentedPanel<T>>;
  value: T;
  onValueChange: (value: T) => void;
  label: string;
  disabled?: boolean;
}
