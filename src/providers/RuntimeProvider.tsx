'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { RuntimeConfig } from '@/models/runtimeConfig';
import { strings } from '@/strings';
const RuntimeContext = createContext<RuntimeConfig | null>(null);
export function RuntimeProvider({
  config,
  children,
}: {
  config: RuntimeConfig;
  children: ReactNode;
}) {
  return (
    <RuntimeContext.Provider value={config}>{children}</RuntimeContext.Provider>
  );
}
export function useRuntimeConfig() {
  const value = useContext(RuntimeContext);
  if (!value) throw new Error(strings.errors.provider);
  return value;
}
