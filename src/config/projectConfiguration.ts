import type { ProjectConfiguration } from './models/projectConfiguration';

/** Project-owned defaults. Configure with npm run initialize -- --help. */
export const projectConfiguration: ProjectConfiguration = {
  schemaVersion: 1,
  profile: 'saas',
  slug: 'portal',
  branding: {
    logoPath: null,
    iconPath: null,
  },
  appearance: {
    themeId: 'portal',
    mode: 'light',
  },
  modules: {
    dashboard: true,
    users: true,
    featureRequests: true,
    chat: true,
    backgroundJobs: true,
    publishing: true,
    media: true,
    notifications: true,
    accountTools: true,
    onboarding: true,
    engagement: true,
  },
  navigation: [
    'dashboard',
    'featureRequests',
    'chat',
    'users',
    'backgroundJobs',
    'publishing',
    'notifications',
    'saved',
    'profile',
    'appearance',
    'account',
    'help',
  ],
  starterData: 'populated',
};
