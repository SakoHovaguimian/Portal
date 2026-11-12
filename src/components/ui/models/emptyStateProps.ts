import type { ReactNode } from 'react';

import type { IconName } from './iconName';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: IconName;
  // Plain sits inside an existing surface; card aliases the standalone outline.
  variant?: 'card' | 'plain' | 'outlined';
}
