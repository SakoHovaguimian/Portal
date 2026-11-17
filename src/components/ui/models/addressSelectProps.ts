import type { SelectProps } from './selectProps';

export type AddressSelectProps = Omit<SelectProps, 'children'> & {
  kind: 'country' | 'region';
  country?: string;
};
