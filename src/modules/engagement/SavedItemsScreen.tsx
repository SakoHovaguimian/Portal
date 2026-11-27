'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import {
  Button,
  DataPanel,
  DirectoryFilters,
  EmptyState,
  ListGroup,
  ListRow,
  Message,
  Page,
  PageHeader,
  QueryBoundary,
  UiIcon,
} from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { portalEngagementStrings as copy } from '@/strings';

import styles from './SavedItems.module.css';
import { useSavedItems, useRemoveSavedItem } from './hooks';
import type { EngagementRecord } from './models/engagementRecord';
import type { SavedItemsScreenProps } from './models/savedItemsScreenProps';
import type { SavedPage } from './models/savedPage';
import type { SavedQuery } from './models/savedQuery';

export function SavedItemsScreen({ query }: SavedItemsScreenProps) {

  const records = useSavedItems(query);
  const remove = useRemoveSavedItem();
  const presentation = usePresentationService();
  const router = useRouter();
  const [failure, setFailure] = useState('');
  const [confirming, setConfirming] = useState(false);
  const navigate = (next: SavedQuery) => {

    const params = new URLSearchParams({
      query: next.query,
      limit: String(next.limit),
      offset: String(next.offset),
    });
    router.push(`/saved?${params}`, { scroll: false });

  };
  const removeItem = async (record: EngagementRecord) => {

    if (confirming || remove.isPending) { return; }
    setConfirming(true);
    setFailure('');
    try {

      if (
        !(await presentation.showAlert({
          title: copy.removeTitle,
          description: copy.removeDescription,
          confirmLabel: copy.remove,
          cancelLabel: copy.cancel,
          tone: 'danger',
        }))
      ) { return; }
      await remove.mutateAsync({ type: record.type, id: record.id });
      void presentation.showToast({
        title: copy.removedTitle,
        intent: 'success',
      });

    } catch {
      setFailure(copy.errorDescription);
    } finally {
      setConfirming(false);
    }

  };

  function renderHeader() {
    return <PageHeader title={copy.title} description={copy.description} />;
  }

  function renderFailure() {

    if (!failure) { return null; }
    return (
      <Message
        intent="danger"
        title={copy.errorTitle}
        description={failure}
      />
    );

  }

  function renderFilters() {

    return (
      <DirectoryFilters
        id="saved-search"
        value={{ query: query.query }}
        statuses={[]}
        showStatus={false}
        onChange={(value) =>
          navigate({ ...query, query: value.query, offset: 0 })
        }
        copy={{
          search: copy.searchLabel,
          placeholder: copy.searchPlaceholder,
          clear: copy.clearSearch,
          status: copy.typeLabel,
          allStatuses: copy.allTypes,
        }}
      />
    );

  }

  function renderSavedItem(record: EngagementRecord) {

    const titleId = `saved-item-${record.type}-${record.id}`;
    return (
      <li key={`${record.type}/${record.id}`}>
        <ListRow
          className={styles.record}
          leading={
            <span aria-hidden="true" className={styles.recordIcon}>
              <UiIcon name="bookmark" className="size-5" />
            </span>
          }
          title={
            <h2 id={titleId} className={styles.recordTitle}>
              {record.target ? (
                <Link href={record.target.href as Route}>
                  {record.target.title}
                </Link>
              ) : (
                copy.unavailableTitle
              )}
            </h2>
          }
          description={
            <p className={styles.recordDescription}>
              {record.target?.description ?? copy.unavailableDescription}
            </p>
          }
          trailing={
            <Button
              variant="destructive"
              aria-describedby={titleId}
              loading={
                remove.isPending &&
                remove.variables?.id === record.id &&
                remove.variables.type === record.type
              }
              disabled={confirming || remove.isPending}
              onClick={() => void removeItem(record)}
            >
              {copy.remove}
            </Button>
          }
        />
      </li>
    );

  }

  function renderSavedItems(page: SavedPage) {

    if (!page.data.length) {

      return (
        <EmptyState
          variant="plain"
          title={query.query ? copy.noResultsTitle : copy.emptyTitle}
          description={
            query.query
              ? copy.noResultsDescription
              : copy.emptyDescription
          }
          action={
            <Button asChild>
              <Link href="/blog">{copy.browse}</Link>
            </Button>
          }
        />
      );

    }
    const savedItems = page.data.map(renderSavedItem);
    return <ListGroup className="rounded-none border-0">{savedItems}</ListGroup>;

  }

  function renderSavedResults() {

    return (
      <QueryBoundary query={records} loadingMessage={copy.loading} inset>
        {(page) => renderSavedItems(page)}
      </QueryBoundary>
    );

  }

  function renderPagination() {

    const page = records.data;
    if (!page) { return null; }
    return (
      <nav
        aria-label={copy.paginationLabel}
        className={styles.pagination}
      >
        <span className="text-sm text-secondary tabular-nums">
          {copy.rangeHint(
            page.total ? page.offset + 1 : 0,
            Math.min(page.total, page.offset + page.limit),
            page.total,
          )}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={records.isFetching || page.offset === 0}
            onClick={() =>
              navigate({
                ...query,
                offset: Math.max(0, page.offset - query.limit),
              })
            }
          >
            {copy.previous}
          </Button>
          <Button
            variant="secondary"
            disabled={
              records.isFetching || page.offset + page.limit >= page.total
            }
            onClick={() =>
              navigate({
                ...query,
                offset: page.offset + query.limit,
              })
            }
          >
            {copy.next}
          </Button>
        </div>
      </nav>
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        {renderFailure()}
        <DataPanel
          busy={records.isFetching}
          busyLabel={copy.loading}
          toolbar={renderFilters()}
          footer={renderPagination()}
        >
          {renderSavedResults()}
        </DataPanel>
      </Page>
    );

  }

  return renderContent();

}
