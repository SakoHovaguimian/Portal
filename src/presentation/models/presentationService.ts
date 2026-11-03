import type { AlertPresentation } from './alertPresentation';
import type { SheetPresentation } from './sheetPresentation';
import type { ToastPresentation } from './toastPresentation';
import type { PresentationRequest } from './presentationRequest';
import type { PresentationMotionConfig } from './presentationMotionConfig';

export type PresentationService = {
  present: (request: PresentationRequest) => Promise<string | boolean>;
  showToast: (request: Omit<ToastPresentation, 'kind'>) => Promise<string>;
  showAlert: (request: Omit<AlertPresentation, 'kind'>) => Promise<boolean>;
  showSheet: (request: Omit<SheetPresentation, 'kind'>) => Promise<boolean>;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  getMotionConfig: () => PresentationMotionConfig;
  setMotionConfig: (config: Partial<PresentationMotionConfig>) => void;
};
