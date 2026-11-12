import type { ComponentPropsWithRef, PropsWithChildren } from 'react';

import type { ButtonVariant } from './buttonVariant';

export type ButtonProps = PropsWithChildren<
  ComponentPropsWithRef<'button'> & {
    variant?: ButtonVariant;
    asChild?: boolean;
    loading?: boolean;
  }
>;
