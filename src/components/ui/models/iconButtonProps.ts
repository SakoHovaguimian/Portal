import type { ComponentProps } from 'react';
import type { Button } from '../components/Button';

export type IconButtonProps = Omit<ComponentProps<typeof Button>, 'asChild' | 'aria-label'> & {
  label: string;
};
