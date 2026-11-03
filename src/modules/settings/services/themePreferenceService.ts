import {
  AppearancePreferenceSchema,
  defaultAppearancePreference,
  type AppearancePreference,
} from '@/models/appearance';

export class ThemePreferenceService {

  // **************************************
  // MARK: - GET THEME PREFERENCE
  // **************************************

  async getPreference(): Promise<AppearancePreference> {

    try {

      return AppearancePreferenceSchema.parse(
        JSON.parse(localStorage.getItem('semantic-web-theme') || '{}'),
      );

    } catch {
      return defaultAppearancePreference;
    }

  }

  // **************************************
  // MARK: - SAVE THEME PREFERENCE
  // **************************************

  async savePreference(value: AppearancePreference) {

    const preference = AppearancePreferenceSchema.parse(value);
    localStorage.setItem('semantic-web-theme', JSON.stringify(preference));
    return preference;

  }

}
