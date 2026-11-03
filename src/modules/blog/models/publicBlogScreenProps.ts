import type { BlogPage } from './blogPage';
import type { BlogQuery } from './blogQuery';

export interface PublicBlogScreenProps {
  page: BlogPage;
  query: BlogQuery;
  categories: string[];
}
