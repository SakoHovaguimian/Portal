import type { BlogQuery } from './blogQuery';

export interface BlogFiltersProps {
  query: BlogQuery;
  onChangeAction: (query: BlogQuery) => void;
  admin?: boolean;
  categories?: string[];
}
