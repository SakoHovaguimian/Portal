import type { ComponentPropsWithRef } from 'react';

export type SelectionChipProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  label: string;
};
