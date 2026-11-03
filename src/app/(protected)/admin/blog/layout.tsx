import type { ChildrenProps } from '@/models/childrenProps';
import { notFound } from 'next/navigation';
import { portalModules } from '@/config/portalModules';

export default function BlogLayout({ children }: ChildrenProps) {

  if (!portalModules.publishing) { notFound(); }
  return children;

}
