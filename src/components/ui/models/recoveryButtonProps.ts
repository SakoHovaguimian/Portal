import type { ComponentProps } from 'react';
import type { Button } from '../components/Button';

export type RecoveryButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'asChild'> & {
  needed: boolean;
};
