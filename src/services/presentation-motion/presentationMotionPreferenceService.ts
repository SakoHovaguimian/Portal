import {
  PresentationMotionConfigSchema,
  defaultPresentationMotionConfig,
  type PresentationMotionConfig,
} from '@/presentation/models/presentationMotionConfig';

export const presentationMotionStorageKey = 'portal-presentation-motion';
export const presentationMotionChangeEvent = 'portal-presentation-motion-change';

export class PresentationMotionPreferenceService {

  // **************************************
  // MARK: - GET PRESENTATION MOTION PREFERENCE
  // **************************************

  async getPreference(): Promise<PresentationMotionConfig> {

    try {
      return PresentationMotionConfigSchema.parse(JSON.parse(localStorage.getItem(presentationMotionStorageKey) || 'null'));
    } catch { return { ...defaultPresentationMotionConfig }; }

  }

  // **************************************
  // MARK: - SAVE PRESENTATION MOTION PREFERENCE
  // **************************************

  async savePreference(value: PresentationMotionConfig): Promise<PresentationMotionConfig> {

    const preference = PresentationMotionConfigSchema.parse(value);
    localStorage.setItem(presentationMotionStorageKey, JSON.stringify(preference));
    window.dispatchEvent(new Event(presentationMotionChangeEvent));
    return preference;

  }

  // **************************************
  // MARK: - RESET PRESENTATION MOTION PREFERENCE
  // **************************************

  async resetPreference(): Promise<PresentationMotionConfig> {

    localStorage.removeItem(presentationMotionStorageKey);
    window.dispatchEvent(new Event(presentationMotionChangeEvent));
    return { ...defaultPresentationMotionConfig };

  }

}
