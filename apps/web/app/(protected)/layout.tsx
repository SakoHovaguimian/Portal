import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppProviders } from '@/providers/AppProviders';
import { ProtectedShell } from '@/components/ProtectedShell';
import { getServerSession } from '@/lib/server/getServerSession';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppProviders session={session}>
      <ProtectedShell initialSession={session}>
        {children}
      </ProtectedShell>
    </AppProviders>
  );
}
