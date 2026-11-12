import { redirect } from 'next/navigation';

import { ProtectedShell } from '@/components/ProtectedShell';
import { getServerSession } from '@/lib/server/getServerSession';
import type { ChildrenProps } from '@/models/childrenProps';
import { AppProviders } from '@/providers/AppProviders';

export default async function ProtectedLayout({
  children,
}: ChildrenProps) {

  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppProviders session={session}>
      <ProtectedShell initialSession={session}>{children}</ProtectedShell>
    </AppProviders>
  );

}
