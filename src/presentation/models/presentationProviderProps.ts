import type { ReactNode } from 'react';
import type { PresentationMotionPreferenceService } from '@/services/presentation-motion/presentationMotionPreferenceService';

export interface PresentationProviderProps {
  children: ReactNode;
  service: PresentationMotionPreferenceService;
}
