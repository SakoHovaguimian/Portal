'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AppSession } from '@semantic-web/core';
import { AppShell } from '@semantic-web/ui';
import { useSessionState } from '@/providers/AppProviders';
import { ShellActions } from '@/components/ShellActions';

export function ProtectedShell({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: AppSession;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useSessionState();

  return (
    <AppShell
      session={session ?? initialSession}
      utilitySlot={<ShellActions />}
      activePath={pathname}
      onNavigate={(href) => {
        if (href !== pathname) {
          router.push(href as never);
        }
      }}
    >
      {children}
    </AppShell>
  );
}
