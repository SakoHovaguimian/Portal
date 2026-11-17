import type { AlertPresentation } from './alertPresentation';
import type { SheetPresentation } from './sheetPresentation';
import type { ToastPresentation } from './toastPresentation';

export type PresentationRequest =
  ToastPresentation | AlertPresentation | SheetPresentation;
