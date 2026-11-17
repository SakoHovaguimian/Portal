import type { ComponentPropsWithRef, ReactNode } from 'react';

export type InputProps = ComponentPropsWithRef<'input'> & {
  leadingIcon?: ReactNode;
};
