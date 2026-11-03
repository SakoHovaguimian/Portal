import type { ReactNode } from 'react';

export interface TooltipProps {
  label: string;
  content: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
}
