'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { LinkProvider } from '@astryxdesign/core/Link'
import { Theme, type ThemeMode } from '@astryxdesign/core/theme'
import { ToastViewport } from '@astryxdesign/core/Toast'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeModeBootstrapAttribute,
  ThemeModeCookieName,
  ThemeModeStorageKey,
  isThemeMode,
} from '@/components/theme/themeMode'
import { portalTheme } from '@/theme/generated/portal'

interface ThemeModeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
const ThemeModeChangeEvent = 'portal-theme-mode-change'

const builtPortalTheme = {
  ...portalTheme,
  icons: neutralTheme.icons,
}

interface ProvidersProps {
  children: React.ReactNode
  initialThemeMode: ThemeMode
}

export function Providers({ children, initialThemeMode }: ProvidersProps) {

  const mode = useSyncExternalStore(
    subscribeToThemeMode,
    getStoredThemeMode,
    () => initialThemeMode,
  )
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  }))

  const setMode = useCallback((nextMode: ThemeMode) => {

    window.localStorage.setItem(ThemeModeStorageKey, nextMode)
    document.cookie = `${ThemeModeCookieName}=${nextMode}; Path=/; Max-Age=31536000; SameSite=Lax`
    window.dispatchEvent(new Event(ThemeModeChangeEvent))

  }, [])

  useEffect(() => {
    document.documentElement.removeAttribute(ThemeModeBootstrapAttribute)
  }, [mode])

  const themeModeContextValue = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return (
    <Theme theme={builtPortalTheme} mode={mode}>
      <LinkProvider component={Link}>
        <QueryClientProvider client={queryClient}>
          <ToastViewport position="topEnd" maxVisible={4}>
            <ThemeModeContext.Provider value={themeModeContextValue}>
              {children}
            </ThemeModeContext.Provider>
          </ToastViewport>
        </QueryClientProvider>
      </LinkProvider>
    </Theme>
  )

}

function subscribeToThemeMode(onStoreChange: () => void): () => void {

  const handleStorage = (event: StorageEvent) => {

    if (!event.key || event.key === ThemeModeStorageKey) {
      onStoreChange()
    }

  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(ThemeModeChangeEvent, onStoreChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(ThemeModeChangeEvent, onStoreChange)
  }

}

function getStoredThemeMode(): ThemeMode {

  const storedMode = window.localStorage.getItem(ThemeModeStorageKey)
  return isThemeMode(storedMode) ? storedMode : 'system'
}

export function useThemeMode(): ThemeModeContextValue {

  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within Providers')
  }

  return context

}
