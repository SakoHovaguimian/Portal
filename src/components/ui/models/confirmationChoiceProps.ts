import type { ComponentPropsWithRef } from 'react';

export type ConfirmationChoiceProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  label: string;
  description: string;
};
