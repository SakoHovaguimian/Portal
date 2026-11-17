import type { ReactNode } from 'react';

import type { BlogArticle } from './blogArticle';

export interface BlogArticleReaderProps {
  article: BlogArticle;
  preview?: boolean;
  accountActions?: ReactNode;
}
