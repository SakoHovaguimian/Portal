import type { ComponentPropsWithoutRef } from 'react';

import type { StepPlayerStep } from './stepPlayerStep';

export type StepPlayerProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'defaultValue'> & {
  steps?: number | readonly StepPlayerStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  duration?: number;
  loop?: boolean;
  onComplete?: () => void;
  size?: number;
  showControl?: boolean;
  controlPosition?: 'left' | 'right';
  seekable?: boolean;
  disabled?: boolean;
};
