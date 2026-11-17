import type { AlertPresentation } from './alertPresentation';
import type { PresentationMotionConfig } from './presentationMotionConfig';
import type { PresentationRequest } from './presentationRequest';
import type { ResolvedPresentationMotionConfig } from './resolvedPresentationMotionConfig';
import type { SheetPresentation } from './sheetPresentation';
import type { ToastPresentation } from './toastPresentation';

export type PresentationService = {
  present: (request: PresentationRequest) => Promise<string | boolean>;
  showToast: (request: Omit<ToastPresentation, 'kind'>) => Promise<string>;
  showAlert: (request: Omit<AlertPresentation, 'kind'>) => Promise<boolean>;
  showSheet: (request: Omit<SheetPresentation, 'kind'>) => Promise<boolean>;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  motionConfig: PresentationMotionConfig;
  effectiveMotionConfig: ResolvedPresentationMotionConfig;
  reducedMotion: boolean;
  getMotionDefaults: () => ResolvedPresentationMotionConfig;
  getMotionConfig: () => PresentationMotionConfig;
  setMotionConfig: (config: Partial<PresentationMotionConfig>) => Promise<void>;
  resetMotionConfig: () => Promise<void>;
  configureMotion: (config: Partial<PresentationMotionConfig>) => () => void;
};
