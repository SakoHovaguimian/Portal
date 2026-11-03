'use client';

import type { RangeSliderProps } from '../models/rangeSliderProps';
import { SliderControl } from './SliderControl';

export function RangeSlider({
  onValueChange,
  onValueCommit,
  ...props
}: RangeSliderProps) {
  return (
    <SliderControl
      {...props}
      range
      onValueChange={(value) => {
        if (Array.isArray(value)) onValueChange?.([value[0], value[1]]);
      }}
      onValueCommit={(value) => {
        if (Array.isArray(value)) onValueCommit?.([value[0], value[1]]);
      }}
    />
  );
}
