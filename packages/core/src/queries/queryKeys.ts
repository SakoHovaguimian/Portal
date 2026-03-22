export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (query: string) => ['users', 'list', query] as const,
    detail: (userId: string) => ['users', 'detail', userId] as const,
  },
  featureRequests: {
    all: ['featureRequests'] as const,
    lists: () => ['featureRequests', 'list'] as const,
    list: (query: string) => ['featureRequests', 'list', query] as const,
    detail: (featureRequestId: string) => ['featureRequests', 'detail', featureRequestId] as const,
  },
  dashboard: {
    overview: ['dashboard', 'overview'] as const,
    models: ['dashboard', 'models'] as const,
    modelDetail: (modelKey: string) => ['dashboard', 'models', modelKey] as const,
    records: (modelKey: string, search: string) => ['dashboard', 'records', modelKey, search] as const,
  },
  appearance: {
    preference: ['appearance', 'preference'] as const,
  },
};

export const staleTimes = {
  authSession: 1000 * 60 * 5,
  users: 1000 * 60,
  featureRequests: 1000 * 30,
  dashboard: 1000 * 15,
};
