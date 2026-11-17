import type { ReactNode } from 'react';

export interface DataPanelProps {
  toolbar?: ReactNode;
  footer?: ReactNode;
  busy?: boolean;
  busyLabel?: string;
  children: ReactNode;
  className?: string;
}
