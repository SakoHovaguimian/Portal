import type { ReactNode, RefObject } from 'react';

import type { AlertAlignment } from './alertAlignment';
import type { AlertTone } from './alertTone';

import type { OverlayMotionProps } from './overlayMotionProps';

export interface AlertModalProps extends OverlayMotionProps {
  open: boolean;
  title: string;
  description: string;
  tone?: AlertTone;
  alignment?: AlertAlignment;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  details?: ReactNode;
  onExitComplete?: () => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
}
