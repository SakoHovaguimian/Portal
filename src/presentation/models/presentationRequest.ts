import type { ToastPresentation } from './toastPresentation';
import type { AlertPresentation } from './alertPresentation';
import type { SheetPresentation } from './sheetPresentation';

export type PresentationRequest =
  ToastPresentation | AlertPresentation | SheetPresentation;
