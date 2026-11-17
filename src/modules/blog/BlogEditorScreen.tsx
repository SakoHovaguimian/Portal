'use client';

import { Page, QueryBoundary } from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import { BlogEditor } from './components/BlogEditor';
import { useBlogArticle } from './hooks';
import type { BlogEditorScreenProps } from './models/blogEditorScreenProps';

const copy = portalPublishingStrings.article;

export function BlogEditorScreen({ articleId }: BlogEditorScreenProps) {

  const article = useBlogArticle(articleId);
  if (!articleId) { return <BlogEditor />; }
  return (
    <Page>
      <QueryBoundary query={article} loadingMessage={copy.adminLoading}>
        {(data) => <BlogEditor key={data.id} initialArticle={data} />}
      </QueryBoundary>
    </Page>
  );

}
