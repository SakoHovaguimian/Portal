import type { ThemeId } from '@/models/themeId';
import type { ThemeMode } from '@/models/themeMode';

export interface ProjectConfiguration {
  schemaVersion: 1;
  profile: 'minimal' | 'internal-tool' | 'saas' | 'content';
  slug: string;
  branding: {
    logoPath: string | null;
    iconPath: string | null;
  };
  appearance: {
    themeId: ThemeId;
    mode: ThemeMode;
  };
  modules: {
    dashboard: boolean;
    users: boolean;
    featureRequests: boolean;
    chat: boolean;
    backgroundJobs: boolean;
    publishing: boolean;
    media: boolean;
    notifications: boolean;
    accountTools: boolean;
    onboarding: boolean;
    engagement: boolean;
  };
  navigation: readonly (
    | 'dashboard'
    | 'users'
    | 'featureRequests'
    | 'chat'
    | 'backgroundJobs'
    | 'publishing'
    | 'notifications'
    | 'saved'
    | 'profile'
    | 'appearance'
    | 'account'
    | 'help'
  )[];
  starterData: 'populated' | 'empty';
}
