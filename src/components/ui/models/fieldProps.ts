import type { ReactNode } from 'react';

export interface FieldProps {
  labelText: string;
  children: ReactNode;
  className?: string;
  // Inline places a compact label beside its control, e.g. in toolbars.
  orientation?: 'vertical' | 'inline';
}
