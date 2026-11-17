import type { SliderOptions } from './sliderOptions';

export interface SliderControlProps extends SliderOptions {
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number | number[]) => void;
  onValueCommit?: (value: number | number[]) => void;
  names?: readonly string[];
  thumbLabels?: readonly string[];
  range?: boolean;
  fillFrom?: 'start' | 'end';
}
