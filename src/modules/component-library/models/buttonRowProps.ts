import type { ButtonPreviewState } from './buttonPreviewState';

export interface ButtonRowProps {
  state: ButtonPreviewState;
  preview: (destructive?: boolean) => void;
}
