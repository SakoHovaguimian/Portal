import type { ReactNode, RefObject } from 'react';

import type { OverlayMotionProps } from './overlayMotionProps';

export interface ModalProps extends OverlayMotionProps {
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
