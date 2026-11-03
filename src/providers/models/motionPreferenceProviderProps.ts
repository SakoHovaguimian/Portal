import type { ChildrenProps } from '@/models/childrenProps';
import type { MotionPreferenceService } from '@/modules/settings/services/motionPreferenceService';

export interface MotionPreferenceProviderProps extends ChildrenProps {
  service: MotionPreferenceService;
}
