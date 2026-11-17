import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button, UiIcon } from '@/components/ui';
import { portalModules } from '@/config/portalModules';
import type { SlugRouteProps } from '@/models/slugRouteProps';
import { portalPublishingStrings } from '@/strings';

import styles from '@/modules/blog/Blog.module.css';
import { BlogArticleCard } from '@/modules/blog/components/BlogArticleCard';
import { BlogArticleReader } from '@/modules/blog/components/BlogArticleReader';
import { publicBlogService } from '@/modules/blog/services/publicBlogService';
import { BlogEngagementControls } from '@/modules/engagement/components/BlogEngagementControls';

const copy = portalPublishingStrings.article;

export const dynamic = 'force-dynamic';
const readArticle = cache(async (slug: string) => {

  try {
    return await publicBlogService.getPublic(slug);
  } catch (error) {

    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 404
    ) { notFound(); }
    throw error;

  }

});
export async function generateMetadata({
  params,
}: SlugRouteProps): Promise<Metadata> {

  const article = await readArticle((await params).slug);
  return { title: article.title, description: article.description };

}

export default async function BlogArticlePage({
  params,
}: SlugRouteProps) {

  const article = await readArticle((await params).slug);
  const related = await publicBlogService.listPublic({
    category: article.category,
    query: '',
    limit: 4,
    offset: 0,
  });
  const nextArticles = related.data
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  function renderRelatedArticles() {

    function renderRelatedArticle(item: (typeof nextArticles)[number]) {

      return (
        <BlogArticleCard key={item.id} article={item} headingLevel="h3" />
      );

    }

    const articleCards = nextArticles.map(renderRelatedArticle);

    return (
      nextArticles.length > 0 && (
        <section className={styles.related}>
          <h2>{copy.relatedTitle}</h2>
          <div className={styles.articleGrid}>
            {articleCards}
          </div>
        </section>
      )
    );

  }

  return (
    <main id="main-content" className={styles.articleContainer}>
      <div className={styles.readerNavigation}>
        <Button asChild variant="ghost">
          <Link href="/blog">
            <UiIcon name="chevronLeft" />
            {copy.backToJournal}
          </Link>
        </Button>
      </div>
      <BlogArticleReader
        article={article}
        accountActions={
          portalModules.engagement ? (
            <BlogEngagementControls
              articleId={article.id}
              slug={article.slug}
            />
          ) : null
        }
      />
      {renderRelatedArticles()}
    </main>
  );

}
