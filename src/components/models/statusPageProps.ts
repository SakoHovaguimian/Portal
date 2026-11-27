import type { ReactNode } from 'react';

import type { IconName } from '@/components/ui/models/iconName';

export interface StatusPageProps {
  title: string;
  description?: string;
  icon: IconName;
  action: ReactNode;
  announce?: boolean;
}
