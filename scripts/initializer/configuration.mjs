export const moduleIds = [
  'dashboard',
  'users',
  'featureRequests',
  'chat',
  'backgroundJobs',
  'publishing',
  'media',
  'notifications',
  'accountTools',
  'onboarding',
  'engagement',
];

export const navigationModules = {
  dashboard: 'dashboard',
  users: 'users',
  featureRequests: 'featureRequests',
  chat: 'chat',
  backgroundJobs: 'backgroundJobs',
  publishing: 'publishing',
  notifications: 'notifications',
  saved: 'engagement',
  profile: null,
  appearance: null,
  account: 'accountTools',
  help: 'accountTools',
};

export const defaultNavigation = [
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
];

export const profiles = {
  minimal: ['dashboard'],
  'internal-tool': [
    'dashboard', 'users', 'featureRequests', 'chat', 'backgroundJobs',
    'notifications', 'accountTools',
  ],
  saas: [
    'dashboard', 'users', 'featureRequests', 'chat', 'backgroundJobs',
    'notifications', 'accountTools', 'onboarding',
  ],
  content: ['dashboard', 'users', 'publishing', 'media', 'accountTools', 'engagement'],
};

export const themeIds = ['portal', 'studio', 'atelier', 'blueprint', 'arcade', 'dusk', 'cupertino'];

export function createModules(enabled) {

  const modules = Object.fromEntries(moduleIds.map((id) => [id, enabled.includes(id)]));
  return modules;

}

export function visibleNavigation(modules) {

  const navigation = defaultNavigation.filter((id) => !navigationModules[id] || modules[navigationModules[id]]);
  return navigation;

}

export function defaultConfiguration() {

  return {
    schemaVersion: 1,
    profile: 'saas',
    slug: 'portal',
    branding: { logoPath: null, iconPath: null },
    appearance: { themeId: 'portal', mode: 'light' },
    modules: createModules(moduleIds),
    navigation: [...defaultNavigation],
    starterData: 'populated',
  };

}
