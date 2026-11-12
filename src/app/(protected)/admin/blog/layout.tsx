import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import type { ChildrenProps } from '@/models/childrenProps';

export default function BlogLayout({ children }: ChildrenProps) {

  if (!portalModules.publishing) { notFound(); }
  return children;

}
