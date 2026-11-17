import type { SliderOptions } from './sliderOptions';

export interface RangeSliderProps extends SliderOptions {
  names?: readonly [string, string];
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
  thumbLabels?: readonly [string, string];
}
