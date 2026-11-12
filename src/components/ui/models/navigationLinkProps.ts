import type Link from 'next/link';
import type { ComponentProps } from 'react';

import type { NavigationPermission } from './navigationPermission';

export type NavigationLinkProps = Omit<
  ComponentProps<typeof Link>,
  'href' | 'onNavigate'
> & {
  href: string;
  beforeNavigate?: NavigationPermission;
  navigate?: (href: string) => void;
};
