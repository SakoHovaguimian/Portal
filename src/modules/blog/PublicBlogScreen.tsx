'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button, EmptyState } from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import styles from './Blog.module.css';
import { BlogArticleCard } from './components/BlogArticleCard';
import { BlogFilters } from './components/BlogFilters';
import { BlogPagination } from './components/BlogPagination';
import { blogQueryParams } from './models/blogQuery';
import type { PublicBlogScreenProps } from './models/publicBlogScreenProps';

const copy = portalPublishingStrings.article;

export function PublicBlogScreen({
  page,
  query,
  categories,
}: PublicBlogScreenProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigate = (next: PublicBlogScreenProps['query']) => {

    const navigationTransition = startTransition(() =>
      router.push(`/blog?${blogQueryParams({ ...next, status: undefined })}`, {
        scroll: false,
      }),
    );

    return navigationTransition;

  };
  const filtered = Boolean(query.query || query.category);

  function renderHeader() {

    return (
      <header className={styles.journalHeader}>
        <h1>{copy.publicTitle}</h1>
        <p className={styles.heroDescription}>{copy.publicDescription}</p>
      </header>

    );

  }

  function renderFilters() {

    return (
      <div className={styles.filters}>
        <BlogFilters
          categories={categories}
          query={query}
          onChangeAction={navigate}
        />
      </div>
    );

  }

  function renderArticleCard(article: PublicBlogScreenProps['page']['data'][number]) {
    return <BlogArticleCard key={article.id} article={article} />;
  }

  function renderArticleResults() {

    if (page.data.length) {

      const isJournalIndex = !filtered && page.offset === 0;
      if (isJournalIndex) {

        const [leadArticle, ...otherArticles] = page.data;
        const topStories = otherArticles.slice(0, 2).map(renderArticleCard);
        const moreStories = otherArticles.slice(2).map(renderArticleCard);
        return (
          <div className={styles.journalStories}>
            <div className={styles.leadGrid}>
              <BlogArticleCard article={leadArticle} variant="lead" />
              {topStories.length > 0 && (
                <div className={styles.storyRail}>{topStories}</div>
              )}
            </div>
            {moreStories.length > 0 && (
              <div className={styles.articleGrid}>{moreStories}</div>
            )}
          </div>
        );

      }
      const articleCards = page.data.map(renderArticleCard);
      return <div className={styles.articleGrid}>{articleCards}</div>;

    }
    return (
      <div className={styles.empty}>
        <EmptyState
          variant="plain"
          title={filtered ? copy.noResultsTitle : copy.emptyTitle}
          description={
            filtered ? copy.noResultsDescription : copy.emptyDescription
          }
        />
        {filtered && (
          <Button
            onClick={() => navigate({ query: '', limit: 6, offset: 0 })}
          >
            {copy.resetFilters}
          </Button>
        )}
      </div>
    );

  }

  function renderPagination() {

    if (!page.data.length && !page.offset && !page.total) { return null; }
    return (
      <div className={styles.pagination}>
        <BlogPagination
          page={page}
          busy={isPending}
          onNavigateAction={(offset) => navigate({ ...query, offset })}
        />
      </div>
    );

  }

  function renderArticleSection() {

    return (
      <section
        className={styles.articleSection}
        aria-label={copy.allArticles}
        aria-busy={isPending}
      >
        {renderFilters()}
        {renderArticleResults()}
        {renderPagination()}
      </section>
    );

  }

  return (
    <main id="main-content" tabIndex={-1} className={styles.journal}>
      {renderHeader()}
      {renderArticleSection()}
    </main>
  );

}
