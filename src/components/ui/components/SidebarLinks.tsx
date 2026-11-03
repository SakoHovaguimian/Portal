'use client';

import type { AppSidebarItem } from '../models/sidebarItem';
import { NavigationLink } from './NavigationLink';
import { cn } from '../lib/cn';

interface SidebarLinksProps {
  items: AppSidebarItem[];
  onNavigate?: (href: string) => void;
}

export function SidebarLinks({ items, onNavigate }: SidebarLinksProps) {
  return items.map((item) => (
    <NavigationLink
      key={item.href}
      href={item.href}
      aria-current={item.active ? 'page' : undefined}
      navigate={onNavigate}
      className={cn(
        'ui-sidebar-link relative flex min-h-(--control-height-lg) w-full cursor-pointer items-center justify-start rounded-control px-4 py-3 text-left text-sm hover:bg-brand-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand',
        item.active
          ? 'font-semibold text-brand-secondary'
          : 'font-medium text-secondary',
      )}
    >
      <span className="relative z-10 flex min-w-0 items-center gap-3">
        <span className="inline-flex shrink-0 items-center justify-center">
          {item.icon}
        </span>
        <span className="min-w-0 text-left wrap-anywhere">{item.label}</span>
      </span>
    </NavigationLink>
  ));
}
