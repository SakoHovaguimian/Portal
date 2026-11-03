import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SelectionTileProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  label: string;
  icon?: ReactNode;
  description?: string;
};
