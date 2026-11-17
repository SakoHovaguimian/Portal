import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';

import type { ControlSize } from './controlSize';
import type { ControlTone } from './controlTone';

export interface ProgressBarProps extends Pick<
  AriaProgressBarProps,
  | 'id'
  | 'value'
  | 'minValue'
  | 'maxValue'
  | 'valueLabel'
  | 'formatOptions'
  | 'aria-describedby'
> {
  label: string;
  description?: string;
  indeterminate?: boolean;
  showValue?: boolean;
  size?: ControlSize;
  tone?: ControlTone;
  locale?: string;
  className?: string;
}
