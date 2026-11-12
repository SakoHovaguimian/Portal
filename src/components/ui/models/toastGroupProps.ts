import type { ToastPosition } from './toastPosition';
import type { ToastStackProps } from './toastStackProps';

export interface ToastGroupProps extends ToastStackProps {
  position: ToastPosition;
}
