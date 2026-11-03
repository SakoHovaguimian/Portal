import type { ToastItem } from './toastItem';

export interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  onExitComplete?: (id: string) => void;
}
