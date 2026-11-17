import type { ReactNode } from 'react';

export interface FloatingAssistantProviderProps {
  // A render callback places the same registered-tool launcher in a page header.
  children: ReactNode | ((launcher: ReactNode) => ReactNode);
  hideLauncher?: boolean;
}
