'use client';

import type { SliderProps } from '../models/sliderProps';
import { SliderControl } from './SliderControl';

export function Slider({
  name,
  onValueChange,
  onValueCommit,
  ...props
}: SliderProps) {

  return (
    <SliderControl
      {...props}
      names={name ? [name] : undefined}
      onValueChange={(value) => {

        if (typeof value === 'number') { onValueChange?.(value); }

      }}
      onValueCommit={(value) => {

        if (typeof value === 'number') { onValueCommit?.(value); }

      }}
    />
  );

}
