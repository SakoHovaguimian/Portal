import type { ReactNode } from 'react';
import type { AlertAlignment, AlertTone, SheetSide, SheetSize, SheetTone, ToastIntent, ToastPosition } from '@semantic-web/ui';

export type PresentationMotionOverride = {
  enabled?: boolean;
  durationMs?: number;
};

export type ToastPresentation = {
  kind: 'toast';
  title: string;
  description?: string;
  intent?: ToastIntent;
  position?: ToastPosition;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  meta?: ReactNode;
  motion?: PresentationMotionOverride;
};

export type AlertPresentation = {
  kind: 'alert';
  title: string;
  description: string;
  tone?: AlertTone;
  alignment?: AlertAlignment;
  confirmLabel?: string;
  cancelLabel?: string;
  details?: ReactNode;
  motion?: PresentationMotionOverride;
};

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

export type PresentationRequest = ToastPresentation | AlertPresentation | SheetPresentation;
