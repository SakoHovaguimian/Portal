'use client';
import { portalPublishingStrings } from '@/strings';
const copy = portalPublishingStrings.article;

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, EmptyState } from '@/components/ui';
import type { BlogPage } from './models/blogPage';
import { blogQueryParams, type BlogQuery } from './models/blogQuery';
import { BlogArticleCard } from './components/BlogArticleCard';
import { BlogFilters } from './components/BlogFilters';
import { BlogPagination } from './components/BlogPagination';
import styles from './Blog.module.css';

export function PublicBlogScreen({
  page,
  query,
  categories,
}: {
  page: BlogPage;
  query: BlogQuery;
  categories: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigate = (next: BlogQuery) =>
    startTransition(() =>
      router.push(`/blog?${blogQueryParams({ ...next, status: undefined })}`, {
        scroll: false,
      }),
    );
  const filtered = Boolean(query.query || query.category);
  return (
    <main id="main-content" className={styles.journal}>
      <header className={styles.journalHeader}>
        <div>
          <p className={styles.eyebrow}>{copy.publicEyebrow}</p>
          <h1>{copy.publicTitle}</h1>
          <p className={styles.heroDescription}>{copy.publicDescription}</p>
        </div>
      </header>
      <section
        className={styles.articleSection}
        aria-label={copy.allArticles}
        aria-busy={isPending}
      >
        <div className={styles.filters}>
          <BlogFilters
            categories={categories}
            query={query}
            onChangeAction={navigate}
          />
        </div>
        {page.data.length ? (
          <div className={styles.articleGrid}>
            {page.data.map((article) => (
              <BlogArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
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
        )}
        <BlogPagination
          page={page}
          busy={isPending}
          onNavigateAction={(offset) => navigate({ ...query, offset })}
        />
      </section>
    </main>
  );
}
