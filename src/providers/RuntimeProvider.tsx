'use client';

import { createContext, useContext } from 'react';

import { strings } from '@/strings';

import type { RuntimeProviderProps } from './models/runtimeProviderProps';

const RuntimeContext = createContext<Pick<RuntimeProviderProps, 'config' | 'routing'> | null>(null);
export function RuntimeProvider({
  config,
  routing,
  children,
}: RuntimeProviderProps) {

  return (
    <RuntimeContext.Provider value={{ config, routing }}>{children}</RuntimeContext.Provider>
  );

}

function useRuntimeContext() {

  const value = useContext(RuntimeContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}

export function useRuntimeConfig() {
  return useRuntimeContext().config;
}

export function useProjectRouting() {
  return useRuntimeContext().routing;
}
