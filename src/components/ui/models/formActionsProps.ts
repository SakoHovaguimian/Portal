import type { ReactNode } from 'react';

export interface FormActionsProps {
  children: ReactNode;
  description?: string;
  sticky?: boolean;
  // Announces description changes, e.g. saving and saved notices.
  live?: boolean;
  variant?: 'panel' | 'inline' | 'plain';
}
