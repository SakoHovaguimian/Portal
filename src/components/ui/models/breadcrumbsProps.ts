import type { BreadcrumbItem } from './breadcrumbItem';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}
