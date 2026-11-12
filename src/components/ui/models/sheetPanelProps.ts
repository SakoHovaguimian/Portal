import type { CSSProperties, ReactNode } from 'react';

import type { SheetSide } from './sheetSide';
import type { SheetSize } from './sheetSize';
import type { SheetTone } from './sheetTone';

export interface SheetPanelProps {
  open: boolean;
  title: string;
  description?: string;
  tone?: SheetTone;
  side?: SheetSide;
  size?: SheetSize;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  details?: ReactNode;
  content?: ReactNode;
  motionEnabled?: boolean;
  motionDurationMs?: number;
  motionStyle?: CSSProperties;
  onExitComplete?: () => void;
}
