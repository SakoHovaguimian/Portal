import type { SliderOptions } from './sliderOptions';

export interface SliderProps extends SliderOptions {
  name?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  /** The fill origin; value and keyboard direction keep their normal meaning. */
  fillFrom?: 'start' | 'end';
}
