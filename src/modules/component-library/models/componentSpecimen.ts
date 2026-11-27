import type { ComponentType } from 'react';

import type { IconName } from '@/components/ui';

import type { ComponentCategory } from './componentCategory';

export interface ComponentSpecimen {
  id: string;
  anchor?: string;
  title: string;
  description: string;
  category: ComponentCategory;
  icon: IconName;
  keywords: string;
  Preview: ComponentType;
}
