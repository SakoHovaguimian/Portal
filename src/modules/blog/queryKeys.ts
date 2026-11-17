import type { BlogQuery } from './models/blogQuery';

export const blogQueryKeys = {
  all: ['portal', 'blog'] as const,
  options: ['portal', 'blog', 'options'] as const,
  list: (query: BlogQuery) => ['portal', 'blog', 'list', query] as const,
  detail: (id?: string) => ['portal', 'blog', 'detail', id] as const,
};
