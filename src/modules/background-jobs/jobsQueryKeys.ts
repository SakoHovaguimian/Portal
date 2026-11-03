import type { BackgroundJobQuery } from './models/backgroundJobQuery';

export const jobsQueryKeys = {
  all: ['jobs'] as const,
  list: (query: BackgroundJobQuery) => ['jobs', 'list', query] as const,
  detail: (id: string) => ['jobs', 'detail', id] as const,
};
