import type { NumberFieldProps } from 'react-aria-components';

import type { ControlSize } from './controlSize';

export interface NumberStepperProps extends Pick<
  NumberFieldProps,
  | 'id'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
  | 'step'
  | 'formatOptions'
  | 'isRequired'
> {
  label: string;
  description?: string;
  errorMessage?: string;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
  locale?: string;
  size?: ControlSize;
  className?: string;
}
