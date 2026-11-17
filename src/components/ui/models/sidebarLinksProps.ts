import type { AppSidebarItem } from './sidebarItem';

export interface SidebarLinksProps {
  items: AppSidebarItem[];
  onNavigate?: (href: string) => void;
}
