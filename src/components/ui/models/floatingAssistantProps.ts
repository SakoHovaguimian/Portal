import type { ReactNode } from 'react';

export interface FloatingAssistantProps {
  id: string;
  title: string;
  description: string;
  disabled: boolean;
  busy: boolean;
  children: ReactNode;
}
