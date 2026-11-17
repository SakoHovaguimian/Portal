import type { ReactNode, Ref } from 'react';

export interface FormSectionProps {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
  headingLevel?: 2 | 3;
  children: ReactNode;
  className?: string;
}
