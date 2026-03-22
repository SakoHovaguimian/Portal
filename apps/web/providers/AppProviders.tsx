'use client';

import {
  HydrationBoundary,
  QueryClientProvider,
  type DehydratedState,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  AppearancePreferenceSchema,
  type AppSession,
  type ServiceContainer,
} from '@semantic-web/core';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createBrowserServiceContainer } from '../lib/client/container';
import { createQueryClient } from '../lib/client/queryClient';
import { PresentationProvider } from '../presentation/PresentationProvider';

const ServiceContainerContext = createContext<ServiceContainer | null>(null);
const SessionContext = createContext<{
  session: AppSession | null;
  setSession: (session: AppSession | null) => void;
} | null>(null);
const ThemeContext = createContext<{
  mode: 'light' | 'dark';
  accent: string;
  setPreference: (value: { mode: 'light' | 'dark'; accent: string }) => Promise<void>;
} | null>(null);

export function AppProviders({
  children,
  session,
  dehydratedState,
}: {
  children: ReactNode;
  session: AppSession | null;
  dehydratedState?: DehydratedState;
}) {
  const [queryClient] = useState(() => createQueryClient());
  const [sessionState, setSessionState] = useState<AppSession | null>(session);
  const container = useMemo(() => createBrowserServiceContainer(sessionState), [sessionState]);
  const [preference, setPreferenceState] = useState(() =>
    AppearancePreferenceSchema.parse({ mode: 'light', accent: 'aqua' }),
  );

  useEffect(() => {
    void container.services.themePreferenceService.getPreference().then((value) => {
      setPreferenceState(value);
      document.documentElement.classList.toggle('dark-mode', value.mode === 'dark');
      document.documentElement.dataset.theme = value.mode;
      document.documentElement.dataset.accent = value.accent;
    });
  }, [container]);

  const themeValue = useMemo(
    () => ({
      mode: preference.mode,
      accent: preference.accent,
      setPreference: async (value: { mode: 'light' | 'dark'; accent: string }) => {
        const parsed = AppearancePreferenceSchema.parse(value);
        const saved = await container.services.themePreferenceService.savePreference(parsed);
        setPreferenceState(saved);
        document.documentElement.classList.toggle('dark-mode', saved.mode === 'dark');
        document.documentElement.dataset.theme = saved.mode;
        document.documentElement.dataset.accent = saved.accent;
      },
    }),
    [container, preference],
  );

  return (
    <SessionContext.Provider value={{ session: sessionState, setSession: setSessionState }}>
      <ServiceContainerContext.Provider value={container}>
        <ThemeContext.Provider value={themeValue}>
          <PresentationProvider>
            <QueryClientProvider client={queryClient}>
              <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </PresentationProvider>
        </ThemeContext.Provider>
      </ServiceContainerContext.Provider>
    </SessionContext.Provider>
  );
}

export function useServiceContainer() {
  const value = useContext(ServiceContainerContext);
  if (!value) {
    throw new Error('ServiceContainer not available');
  }
  return value;
}

export function useSessionState() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('Session context not available');
  }
  return value;
}

export function useThemePreference() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('Theme context not available');
  }
  return value;
}
