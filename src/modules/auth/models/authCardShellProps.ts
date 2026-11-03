import type { ReactNode } from 'react';

export interface AuthCardShellProps {
  badge: string;
  title: string;
  description: string;
  footerPrompt: string;
  footerHref: string;
  footerAction: string;
  children: ReactNode;
  mockHint?: string;
}
