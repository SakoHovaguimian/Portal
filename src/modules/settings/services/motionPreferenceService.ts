import {
  MotionPreferenceSchema,
  defaultMotionPreference,
  type MotionPreference,
} from '@/models/motionPreference';

export class MotionPreferenceService {

  // **************************************
  // MARK: - GET MOTION PREFERENCE
  // **************************************

  async getPreference(): Promise<MotionPreference> {

    try {

      return MotionPreferenceSchema.parse(
        JSON.parse(localStorage.getItem('portal-motion') || 'null'),
      );

    } catch {
      return defaultMotionPreference;
    }

  }

  // **************************************
  // MARK: - SAVE MOTION PREFERENCE
  // **************************************

  async savePreference(value: MotionPreference) {

    const preference = MotionPreferenceSchema.parse(value);
    localStorage.setItem('portal-motion', JSON.stringify(preference));
    return preference;

  }

}
