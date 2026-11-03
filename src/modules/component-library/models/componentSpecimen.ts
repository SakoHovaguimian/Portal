import type { ComponentType } from 'react';
import type { IconName } from '@/components/ui';
import type { ComponentCategory } from './componentCategory';

export interface ComponentSpecimen {
  id: string;
  title: string;
  description: string;
  category: Exclude<ComponentCategory, 'all'>;
  icon: IconName;
  keywords: string;
  isNew?: boolean;
  Preview: ComponentType;
}
