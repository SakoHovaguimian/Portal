import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { portalModules } from '@/config/portalModules';
export default function BlogLayout({ children }: { children: ReactNode }) {
  if (!portalModules.publishing) notFound();
  return children;
}
