import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppProviders } from '@/providers/AppProviders';
import { getServerSession } from '@/lib/server/getServerSession';

export default async function ImmersiveLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <AppProviders session={session}>{children}</AppProviders>;
}
