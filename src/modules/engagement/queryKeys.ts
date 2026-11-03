import type { SavedQuery } from './models/savedQuery';

export const engagementQueryKeys = {
  all: ['portal', 'engagement'] as const,
  saved: (query: SavedQuery) =>
    ['portal', 'engagement', 'saved', query] as const,
};
