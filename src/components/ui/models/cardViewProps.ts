import type { ReactNode } from 'react';

export interface CardViewProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}
