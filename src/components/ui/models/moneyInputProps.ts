import type { ComponentProps } from 'react';

import type { Input } from '../components/Input';

export type MoneyInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> & {
  value: string;
  onValueChange: (value: string) => void;
  currencyCode?: string;
};
