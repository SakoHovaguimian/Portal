import type { ReactNode } from 'react';
import type { PresentationMotionOverride } from './presentationMotionOverride';
import type { AlertTone, AlertAlignment } from '@/components/ui';
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
