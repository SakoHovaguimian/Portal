'use client';

import { usePathname } from 'next/navigation';

import { ShellActions } from '@/components/ShellActions';
import { AppShell, Button, UiIcon } from '@/components/ui';
import { portalModules } from '@/config/portalModules';
import { portalNavigation } from '@/config/portalNavigation';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { useSessionState } from '@/providers/AppProviders';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { useGuardedBack } from '@/providers/useGuardedBack';
import { useGuardedNavigate } from '@/providers/useGuardedNavigate';
import { portalModuleStrings } from '@/strings';

import type { ProtectedShellProps } from './models/protectedShellProps';
import { DemoSimulationNotice } from '@/modules/dev-settings/components/DemoSimulationNotice';
import { NotificationInboxLink } from '@/modules/notification-inbox/components/NotificationInboxLink';
import { ThemeToggle } from '@/modules/settings/components/ThemeToggle';

export function ProtectedShell({
  children,
  initialSession,
}: ProtectedShellProps) {

  const navigate = useGuardedNavigate();
  const pathname = usePathname();
  const { session } = useSessionState();
  const runtime = useRuntimeConfig();
  const back = useGuardedBack(getDefaultProjectRoute((session ?? initialSession).user.role));
  const current = session ?? initialSession;

  function renderUtilities() {

    return (
      <>
        <Button variant="ghost" onClick={() => void back()}>
          <UiIcon name="chevronLeft" />
          {portalModuleStrings.back}
        </Button>
        {portalModules.notifications && <NotificationInboxLink />}
        <ThemeToggle />
      </>
    );

  }

  return (
    <AppShell
      session={current}
      contentLayout={pathname === '/chat' ? 'workspace' : 'page'}
      navigationItems={portalNavigation(current.user, runtime)}
      accountSlot={<ShellActions />}
      utilitySlot={renderUtilities()}
      bannerSlot={runtime.demoMode && runtime.devSettingsEnabled ? <DemoSimulationNotice /> : undefined}
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
