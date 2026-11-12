import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/server/getServerSession';
import type { ChildrenProps } from '@/models/childrenProps';
import { AppProviders } from '@/providers/AppProviders';

export default async function ImmersiveLayout({
  children,
}: ChildrenProps) {

  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <AppProviders session={session}>{children}</AppProviders>;

}
