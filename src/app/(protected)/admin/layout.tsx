import { notFound } from 'next/navigation';

import { getServerSession } from '@/lib/server/getServerSession';
import type { ChildrenProps } from '@/models/childrenProps';
import { canManageContent } from '@/services/auth/permissions';

export default async function AdministrationLayout({
  children,
}: ChildrenProps) {

  const session = await getServerSession();
  if (!session || !canManageContent(session.user.role)) { notFound(); }
  return children;

}
