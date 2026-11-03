import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getServerSession } from '@/lib/server/getServerSession';
import { canManageContent } from '@/services/auth/permissions';
export default async function AdministrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session || !canManageContent(session.user.role)) notFound();
  return children;
}
