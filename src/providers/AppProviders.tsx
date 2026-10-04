'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppearancePreferenceSchema, type AppSession } from '@/models';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ClientServiceContainer } from '@/clientContainer';
import { createQueryClient } from '@/lib/client/queryClient';
import { PresentationProvider } from '@/presentation/PresentationProvider';
import { RealtimeProvider } from '@/services/realtime/RealtimeProvider';
import { SessionKeepAlive } from '@/services/session/components/SessionKeepAlive';
import { strings } from '@/strings';
const ContainerContext = createContext<ClientServiceContainer | null>(null);
const SessionContext = createContext<{
  session: AppSession | null;
  setSession: (session: AppSession | null) => void;
} | null>(null);
const ThemeContext = createContext<{
  mode: 'light' | 'dark';
  accent: string;
  setPreference: (value: {
    mode: 'light' | 'dark';
    accent: string;
  }) => Promise<void>;
} | null>(null);
export function AppProviders({
  children,
  session,
}: {
  children: ReactNode;
  session: AppSession | null;
}) {
  const [queryClient] = useState(createQueryClient);
  const [sessionState, setSession] = useState(session);
  const [container] = useState(() => new ClientServiceContainer());
  const [preference, setPreferenceState] = useState(() =>
    AppearancePreferenceSchema.parse({ mode: 'light', accent: 'aqua' }),
  );
  function applyTheme(value: { mode: string; accent: string }) {
    document.documentElement.classList.toggle(
      'dark-mode',
      value.mode === 'dark',
    );
    document.documentElement.dataset.theme = value.mode;
    document.documentElement.dataset.accent = value.accent;
  }
  useEffect(() => {
    void container.themePreferenceService.getPreference().then((value) => {
      setPreferenceState(value);
      applyTheme(value);
    });
  }, [container]);
  const theme = useMemo(
    () => ({
      mode: preference.mode,
      accent: preference.accent,
      setPreference: async (value: {
        mode: 'light' | 'dark';
        accent: string;
      }) => {
        const saved = await container.themePreferenceService.savePreference(
          AppearancePreferenceSchema.parse(value),
        );
        setPreferenceState(saved);
        applyTheme(saved);
      },
    }),
    [container, preference],
  );
  return (
    <SessionContext.Provider value={{ session: sessionState, setSession }}>
      <ContainerContext.Provider value={container}>
        <ThemeContext.Provider value={theme}>
          <QueryClientProvider client={queryClient}>
            <PresentationProvider>
              <RealtimeProvider>
                <SessionKeepAlive />
                {children}
              </RealtimeProvider>
            </PresentationProvider>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ThemeContext.Provider>
      </ContainerContext.Provider>
    </SessionContext.Provider>
  );
}
export function useServiceContainer() {
  const value = useContext(ContainerContext);
  if (!value) throw new Error(strings.errors.provider);
  return value;
}
export function useSessionState() {
  const value = useContext(SessionContext);
  if (!value) throw new Error(strings.errors.provider);
  return value;
}
export function useThemePreference() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error(strings.errors.provider);
  return value;
}
