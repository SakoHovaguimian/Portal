import type { ReactNode } from 'react';

export interface SidebarSwitcherDisclosureProps {
  title: string;
  subtitle: string;
  ariaLabel: string;
  leading: ReactNode;
  disabled?: boolean;
  children: (close: () => void) => ReactNode;
}
