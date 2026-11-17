import type { BlogPage } from './blogPage';

export interface BlogPaginationProps {
  page: BlogPage;
  busy?: boolean;
  onNavigateAction: (offset: number) => void;
}
