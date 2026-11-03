import type { ComponentProps, ReactNode } from 'react';
import type { Radio } from '../components/Radio';

export type RadioCardProps = Omit<ComponentProps<typeof Radio>, 'label'> & {
  label: string;
  description: string;
  icon: ReactNode;
};
