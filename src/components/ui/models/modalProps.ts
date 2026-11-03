import type { ReactNode, RefObject } from 'react';

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  onDismiss: () => void;
  children: ReactNode;
  footer?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  size?: 'default' | 'wide';
}
