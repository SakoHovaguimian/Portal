import type { ReactNode, Ref } from 'react';
import type { BreadcrumbItem } from './breadcrumbItem';

export interface PageHeaderProps {
  title: string;
  description?: string;
  descriptionAction?: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  action?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  meta?: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
  headingLevel?: 'h1' | 'h2' | 'h3';
  onNavigate?: (href: string) => void;
}
