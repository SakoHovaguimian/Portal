import type { ReactNode } from 'react';

export interface AuthCardShellProps {
  title: string;
  description: string;
  footerPrompt: string;
  footerHref: string;
  footerAction: string;
  children: ReactNode;
  supportingContent?: ReactNode;
}
