import type { ReactNode } from 'react';

export interface MobileRecordRowProps {
  title: ReactNode;
  leading?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  summary?: ReactNode;
  className?: string;
}
