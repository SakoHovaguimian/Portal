import type { ReactNode } from 'react';

export interface MetricCardProps {
  eyebrow: string;
  value: string;
  caption: string;
  icon?: ReactNode;
  change?: string;
}
