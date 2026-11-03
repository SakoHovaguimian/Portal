'use client';

import { strings } from '@/strings';
import type { BreadcrumbItem } from '../models/breadcrumbItem';
import { NavigationLink } from './NavigationLink';
import { UiIcon } from './UiIcon';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label={strings.pageLayout.breadcrumbs} className="min-w-0">
      <ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-1 gap-y-1 p-0 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li
              key={`${index}:${item.label}`}
              className="flex min-w-0 items-center gap-1"
            >
              {index > 0 && (
                <UiIcon
                  name="chevronRight"
                  className="size-4 text-quaternary"
                />
              )}
              {item.href && !current ? (
                <NavigationLink
                  href={item.href}
                  navigate={onNavigate}
                  className="ui-breadcrumb-link max-w-72 truncate rounded-control px-1 py-0.5 font-medium text-tertiary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
                >
                  {item.label}
                </NavigationLink>
              ) : (
                <span
                  aria-current={current ? 'page' : undefined}
                  className="max-w-96 truncate px-1 py-0.5 font-medium text-secondary"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
