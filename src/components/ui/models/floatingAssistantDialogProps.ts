import type { ReactNode } from 'react';

export interface FloatingAssistantDialogProps {
  open: boolean;
  title: string;
  description: string;
  busy?: boolean;
  onClose: () => void;
  onReturnFocus: () => void;
  children: ReactNode;
}
