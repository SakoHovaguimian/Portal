import type { BlogArticle } from './blogArticle';

export interface BlogArticleCardProps {
  article: BlogArticle;
  headingLevel?: 'h2' | 'h3';
  variant?: 'journal' | 'related';
}
