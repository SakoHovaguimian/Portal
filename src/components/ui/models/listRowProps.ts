import type { ReactNode } from 'react';

export interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}
