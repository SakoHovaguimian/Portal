import type { ReactNode } from 'react';
import type { ControlSize } from './controlSize';
import type { ControlTone } from './controlTone';

export interface SliderOptions {
  id?: string;
  label: string;
  description?: string;
  errorMessage?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: ControlSize;
  tone?: ControlTone;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  showValue?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  /** Localizes number output and screen-reader value text. */
  locale?: string;
  /** Decorative scale positions, expressed in the same units as value. */
  marks?: readonly number[];
  className?: string;
}
