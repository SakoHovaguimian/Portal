import { notFound } from 'next/navigation';
import type { ChildrenProps } from '@/models/childrenProps';
import { portalModules } from '@/config/portalModules';

export default function ModuleLayout({ children }: ChildrenProps) {

  if (!portalModules.featureRequests) { notFound(); }
  return children;

}
