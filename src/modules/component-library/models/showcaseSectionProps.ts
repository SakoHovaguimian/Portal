import type { ReactNode } from 'react';

import type { IconName } from '@/components/ui';

export interface ShowcaseSectionProps {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  children: ReactNode;
}
