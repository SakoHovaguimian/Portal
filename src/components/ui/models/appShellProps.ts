import type { Route } from 'next';
import type { PropsWithChildren, ReactNode } from 'react';

import type { AppSession } from '@/models/appSession';

import type { AppSidebarItem } from './sidebarItem';

export type AppShellProps = PropsWithChildren<{
  session: AppSession;
  homeHref: Route;
  utilitySlot?: ReactNode;
  accountSlot?: ReactNode;
  bannerSlot?: ReactNode;
  contextSlot?: ReactNode;
  activePath?: string;
  onNavigate?: (href: string) => void;
  navigationItems: AppSidebarItem[];
  contentLayout?: 'page' | 'workspace';
}>;
