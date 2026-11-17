import type { ReactNode, Ref } from 'react';

export interface SplitSectionProps {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
  bare?: boolean;
  children: ReactNode;
  className?: string;
}
