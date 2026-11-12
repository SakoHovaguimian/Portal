import type { CSSProperties, ReactNode, RefObject } from 'react';

import type { AlertAlignment } from './alertAlignment';
import type { AlertTone } from './alertTone';

export interface AlertModalProps {
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
  motionEnabled?: boolean;
  motionDurationMs?: number;
  motionStyle?: CSSProperties;
  onExitComplete?: () => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
}
