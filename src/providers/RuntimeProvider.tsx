'use client';

import type { RuntimeProviderProps } from './models/runtimeProviderProps';
import { createContext, useContext } from 'react';
import type { RuntimeConfig } from '@/models/runtimeConfig';
import { strings } from '@/strings';

const RuntimeContext = createContext<RuntimeConfig | null>(null);
export function RuntimeProvider({
  config,
  children,
}: RuntimeProviderProps) {

  return (
    <RuntimeContext.Provider value={config}>{children}</RuntimeContext.Provider>
  );

}

export function useRuntimeConfig() {

  const value = useContext(RuntimeContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}
