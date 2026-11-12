'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Badge,
  Button,
  DataPanel,
  DataTable,
  EmptyState,
  MobileRecordRow,
  Page,
  PageHeader,
  QueryBoundary,
  RecordThumbnail,
  UiIcon,
} from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import styles from './BlogAdmin.module.css';
import { BlogFilters } from './components/BlogFilters';
import { BlogPagination } from './components/BlogPagination';
import { formatBlogDate } from './formatBlogDate';
import { useBlogArticles, useBlogOptions } from './hooks';
import type { AdminBlogScreenProps } from './models/adminBlogScreenProps';
import type { BlogArticle } from './models/blogArticle';
import { blogCategoryLabel } from './models/blogCategory';
import { blogCoverSource } from './models/blogCover';
import { isBlogImageUrl } from './models/blogImageUrl';
import type { BlogPage } from './models/blogPage';
import { blogQueryParams, type BlogQuery } from './models/blogQuery';
import type { BlogStatus } from './models/blogStatus';

const copy = portalPublishingStrings.article;

export function AdminBlogScreen({ query }: AdminBlogScreenProps) {

  const router = useRouter();
  const articles = useBlogArticles(query);
  const options = useBlogOptions();
  const navigate = (next: BlogQuery) =>
    router.push(`/admin/blog?${blogQueryParams(next)}`, { scroll: false });
  const filtered = Boolean(query.query || query.category || query.status);

  function renderHeader() {

    return (
      <div className={styles.intro} data-tone="lilac">
        <PageHeader
          title={copy.adminTitle}
          description={copy.adminDescription}
          action={
            <Button asChild>
              <Link href="/admin/blog/new">
                <UiIcon name="plus" />
                {copy.newArticle}
              </Link>
            </Button>
          }
        />
      </div>

    );

  }

  function renderBadge(status: BlogStatus) {

    return (
      <Badge intent={status === 'published' ? 'success' : 'neutral'} dot>
        {copy.statuses[status]}
      </Badge>
    );

  }

  function renderThumbnail(article: BlogArticle) {

    return (
      <span className={styles.articleThumbnail} data-cover={article.cover}>
        <RecordThumbnail
          src={
            isBlogImageUrl(article.cover)
              ? blogCoverSource(article.cover)
              : undefined
          }
          hasImage={isBlogImageUrl(article.cover)}
          emptyLabel={copy.coverOptions.none}
          alt={copy.decorativeAlt}
        />
      </span>
    );

  }

  function renderFilters() {

    return (
      <BlogFilters
        admin
        categories={options.data?.categories}
        query={query}
        onChangeAction={navigate}
      />
    );

  }

  function renderPaginationFooter() {

    if (!articles.data) { return undefined; }
    return (
      <BlogPagination
        page={articles.data}
        busy={articles.isFetching}
        onNavigateAction={(offset) => navigate({ ...query, offset })}
      />
    );

  }

  function renderMobileRow(article: BlogArticle) {

    return (
      <MobileRecordRow
        leading={renderThumbnail(article)}
        title={
          <Link href={`/admin/blog/${article.id}`}>{article.title}</Link>
        }
        description={blogCategoryLabel(article.category)}
        summary={
          <dl className="m-0 flex flex-wrap gap-x-2 gap-y-1 text-xs text-tertiary">
            <dt>{copy.updatedColumn}</dt>
            <dd className="m-0">
              <time dateTime={article.updatedAt}>
                {formatBlogDate(article.updatedAt)}
              </time>
            </dd>
          </dl>
        }
        footer={
          <div className="flex flex-wrap items-center gap-3">
            {renderBadge(article.status)}
            <span>{article.author}</span>
          </div>
        }
      />
    );

  }

  function renderArticleIdentity(article: BlogArticle) {

    return (
      <div className={styles.articleIdentity}>
        {renderThumbnail(article)}
        <div className="grid gap-1">
          <Link
            className="font-medium text-primary hover:text-brand-secondary"
            href={`/admin/blog/${article.id}`}
          >
            {article.title}
          </Link>
          <span className="text-xs text-tertiary">{article.author}</span>
        </div>
      </div>
    );

  }

  function renderEmptyState() {

    return (
      <EmptyState
        variant="plain"
        title={filtered ? copy.adminNoResultsTitle : copy.adminEmptyTitle}
        description={
          filtered
            ? copy.adminNoResultsDescription
            : copy.adminEmptyDescription
        }
        action={
          !filtered ? (
            <Button asChild>
              <Link href="/admin/blog/new">{copy.newArticle}</Link>
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => navigate({ query: '', limit: 10, offset: 0 })}
            >
              {copy.resetFilters}
            </Button>
          )
        }
      />
    );

  }

  function renderArticleResults(page: BlogPage) {

    if (!page.data.length) { return renderEmptyState(); }
    return (
      <DataTable
        embedded
        caption={copy.tableCaption}
        rows={page.data}
        getRowKey={(article) => article.id}
        getRowHref={(article) => `/admin/blog/${article.id}`}
        renderMobileRow={renderMobileRow}
        columns={[
          {
            key: 'title',
            header: copy.titleColumn,
            render: renderArticleIdentity,
          },
          {
            key: 'status',
            header: copy.statusColumn,
            render: (article) => renderBadge(article.status),
          },
          {
            key: 'category',
            header: copy.topicColumn,
            render: (article) => blogCategoryLabel(article.category),
          },
          {
            key: 'updatedAt',
            header: copy.updatedColumn,
            render: (article) => (
              <time dateTime={article.updatedAt}>
                {formatBlogDate(article.updatedAt)}
              </time>
            ),
          },
        ]}
      />
    );

  }

  function renderDirectoryResults() {

    return (
      <QueryBoundary
        query={articles}
        loadingMessage={copy.adminLoading}
        inset
      >
        {(page) => renderArticleResults(page)}
      </QueryBoundary>
    );

  }

  function renderDirectory() {

    return (
      <DataPanel
        className={styles.directoryPanel}
        toolbar={renderFilters()}
        busy={articles.isFetching}
        busyLabel={copy.adminLoading}
        footer={renderPaginationFooter()}
      >
        {renderDirectoryResults()}
      </DataPanel>
    );

  }

  return (
    <Page>
      {renderHeader()}
      {renderDirectory()}
    </Page>
  );

}
