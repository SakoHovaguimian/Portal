import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type AnimatedCounterProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'prefix'> & {
  value: number;
  decimals?: number;
  duration?: number;
  padStart?: number;
  separator?: string;
  decimalSeparator?: string;
  grouping?: 'western' | 'indian';
  prefix?: ReactNode;
  suffix?: ReactNode;
};
