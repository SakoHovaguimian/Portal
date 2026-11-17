import type { ReactNode } from 'react';

import type { SheetSide } from './sheetSide';
import type { SheetSize } from './sheetSize';
import type { SheetTone } from './sheetTone';

import type { OverlayMotionProps } from './overlayMotionProps';

export interface SheetPanelProps extends OverlayMotionProps {
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
  onExitComplete?: () => void;
}
