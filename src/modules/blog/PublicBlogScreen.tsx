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
        <div>
          <p className={styles.eyebrow}>{copy.publicEyebrow}</p>
          <h1>{copy.publicTitle}</h1>
          <p className={styles.heroDescription}>{copy.publicDescription}</p>
        </div>
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

      const articleCards = page.data.map(renderArticleCard);
      return <div className={styles.articleGrid}>{articleCards}</div>;

    }
    return (
      <div className={styles.empty}>
        <EmptyState
          title={filtered ? copy.noResultsTitle : copy.emptyTitle}
          description={
            filtered ? copy.noResultsDescription : copy.emptyDescription
          }
        />
        {filtered && (
          <Button
            variant="secondary"
            onClick={() => navigate({ query: '', limit: 6, offset: 0 })}
          >
            {copy.resetFilters}
          </Button>
        )}
      </div>
    );

  }

  function renderPagination() {

    return (
      <BlogPagination
        page={page}
        busy={isPending}
        onNavigateAction={(offset) => navigate({ ...query, offset })}
      />
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
    <main id="main-content" className={styles.journal}>
      {renderHeader()}
      {renderArticleSection()}
    </main>
  );

}
