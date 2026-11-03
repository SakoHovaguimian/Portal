import type { MotionPreference } from '@/models/motionPreference';

export interface MotionPreferenceContextValue {
  preference: MotionPreference;
  setPreference: (value: MotionPreference) => Promise<void>;
}
