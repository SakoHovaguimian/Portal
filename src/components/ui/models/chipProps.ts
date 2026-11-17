import type { ReactNode } from 'react';

export interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  className?: string;
}
