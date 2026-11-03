import type { ReactNode, Ref } from 'react';

export interface PageSectionProps {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  actionAlignment?: 'end' | 'center';
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
  className?: string;
}
