import type { ReactNode } from 'react';

export type DashboardPanelProps = {
  eyebrow: string;
  title: string;
  value?: string;
  delta?: string;
  children: ReactNode;
  legend?: ReactNode;
};
