'use client';

import type { AppProvidersProps } from './models/appProvidersProps';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { SessionContextValue } from './models/sessionContextValue';
import { createContext, useContext, useState } from 'react';
import { ClientServiceContainer } from '@/clientContainer';
import { createQueryClient } from '@/lib/client/queryClient';
import { PresentationProvider } from '@/presentation/PresentationProvider';
import { RealtimeProvider } from '@/services/realtime/RealtimeProvider';
import { SessionKeepAlive } from '@/services/session/components/SessionKeepAlive';
import { strings } from '@/strings';
import { ThemePreferenceProvider } from './ThemePreferenceProvider';
import { MotionPreferenceProvider } from './MotionPreferenceProvider';
import { NavigationGuardProvider } from './NavigationGuardProvider';
import { FloatingAssistantProvider } from '@/components/ui/components/FloatingAssistantProvider';
import { OnboardingGate } from '@/modules/onboarding/OnboardingGate';
import { NotificationTimezoneSync } from '@/modules/notification-inbox/components/NotificationTimezoneSync';
import { portalModules } from '@/config/portalModules';

export { useThemePreference } from './ThemePreferenceProvider';
const ContainerContext = createContext<ClientServiceContainer | null>(null);
const SessionContext = createContext<SessionContextValue | null>(null);
export function AppProviders({
  children,
  session,
}: AppProvidersProps) {

  const [queryClient] = useState(createQueryClient);
  const [sessionState, setSession] = useState(session);
  const [container] = useState(() => new ClientServiceContainer());
  return (
    <SessionContext.Provider value={{ session: sessionState, setSession }}>
      <ContainerContext.Provider value={container}>
        <ThemePreferenceProvider service={container.themePreferenceService}>
          <MotionPreferenceProvider service={container.motionPreferenceService}>
            <QueryClientProvider client={queryClient}>
              <PresentationProvider service={container.presentationMotionPreferenceService}>
                <NavigationGuardProvider>
                  <FloatingAssistantProvider>
                    <RealtimeProvider>
                      <SessionKeepAlive />
                      {portalModules.notifications && (
                        <NotificationTimezoneSync />
                      )}
                      {portalModules.onboarding ? (
                        <OnboardingGate>{children}</OnboardingGate>
                      ) : (
                        children
                      )}
                    </RealtimeProvider>
                  </FloatingAssistantProvider>
                </NavigationGuardProvider>
              </PresentationProvider>
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </QueryClientProvider>
          </MotionPreferenceProvider>
        </ThemePreferenceProvider>
      </ContainerContext.Provider>
    </SessionContext.Provider>
  );

}

export function useServiceContainer() {

  const value = useContext(ContainerContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}

export function useSessionState() {

  const value = useContext(SessionContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}
