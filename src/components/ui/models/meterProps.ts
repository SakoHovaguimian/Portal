import type { MeterProps as AriaMeterProps } from 'react-aria-components';

import type { ControlSize } from './controlSize';
import type { ControlTone } from './controlTone';

export interface MeterProps extends Pick<
  AriaMeterProps,
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
  showValue?: boolean;
  size?: ControlSize;
  tone?: ControlTone;
  locale?: string;
  className?: string;
}
