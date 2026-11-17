import type { ComponentPropsWithRef } from 'react';

export type SwitchProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'role'> & {
  label: string;
  description?: string;
};
