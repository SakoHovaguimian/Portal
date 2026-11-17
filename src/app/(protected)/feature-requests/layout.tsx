import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import type { ChildrenProps } from '@/models/childrenProps';

export default function ModuleLayout({ children }: ChildrenProps) {

  if (!portalModules.featureRequests) { notFound(); }
  return children;

}
