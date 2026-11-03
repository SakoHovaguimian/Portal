'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { AppSession } from '@/models';
import { AppShell, Button, UiIcon } from '@/components/ui';
import { useSessionState } from '@/providers/AppProviders';
import { ThemeToggle } from '@/modules/settings/components/ThemeToggle';
import { useGuardedNavigate } from '@/providers/useGuardedNavigate';
import { ShellActions } from '@/components/ShellActions';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { useGuardedBack } from '@/providers/useGuardedBack';
import { portalNavigation } from '@/config/portalNavigation';
import { portalModules } from '@/config/portalModules';
import { NotificationInboxLink } from '@/modules/notification-inbox/components/NotificationInboxLink';
import { portalModuleStrings } from '@/strings';

export function ProtectedShell({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: AppSession;
}) {
  const navigate = useGuardedNavigate();
  const pathname = usePathname();
  const { session } = useSessionState();
  const runtime = useRuntimeConfig();
  const back = useGuardedBack('/dashboard');
  const current = session ?? initialSession;

  return (
    <AppShell
      session={current}
      navigationItems={portalNavigation(current.user, runtime)}
      accountSlot={<ShellActions />}
      utilitySlot={
        <>
          <Button variant="ghost" onClick={() => void back()}>
            <UiIcon name="chevronLeft" />
            {portalModuleStrings.back}
          </Button>
          {portalModules.notifications && <NotificationInboxLink />}
          <ThemeToggle />
        </>
      }
      activePath={pathname}
      onNavigate={(href) => {
        if (href !== pathname) {
          void navigate(href);
        }
      }}
    >
      {children}
    </AppShell>
  );
}
