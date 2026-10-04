import type { ReactNode } from 'react';
import type { PresentationMotionOverride } from './presentationMotionOverride';
import type { SheetTone, SheetSide, SheetSize } from '@/components/ui';
export type SheetPresentation = {
  kind: 'sheet';
  title: string;
  description?: string;
  tone?: SheetTone;
  side?: SheetSide;
  size?: SheetSize;
  confirmLabel?: string;
  cancelLabel?: string;
  details?: ReactNode;
  content?: ReactNode;
  motion?: PresentationMotionOverride;
};
