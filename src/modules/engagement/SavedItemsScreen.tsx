'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import {
  Button,
  Card,
  DataPanel,
  DirectoryFilters,
  EmptyState,
  Message,
  Page,
  PageHeader,
  QueryBoundary,
} from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { portalEngagementStrings as copy } from '@/strings';

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

    return (
      <Card
        key={`${record.type}/${record.id}`}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div className="grid min-w-0 flex-1 gap-2">
          {record.target ? (
            <>
              <Link
                className="font-semibold text-primary hover:text-brand-secondary"
                href={record.target.href as Route}
              >
                {record.target.title}
              </Link>
              <p className="m-0 text-sm text-secondary">
                {record.target.description}
              </p>
            </>
          ) : (
            <>
              <h2 className="m-0 text-lg font-semibold">
                {copy.unavailableTitle}
              </h2>
              <p className="m-0 text-sm text-secondary">
                {copy.unavailableDescription}
              </p>
            </>
          )}
        </div>
        <Button
          variant="destructive"
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
      </Card>
    );

  }

  function renderSavedItems(page: SavedPage) {

    if (!page.data.length) {

      return (
        <EmptyState
          title={query.query ? copy.noResultsTitle : copy.emptyTitle}
          description={
            query.query
              ? copy.noResultsDescription
              : copy.emptyDescription
          }
          action={
            <Button asChild variant="secondary">
              <Link href="/blog">{copy.browse}</Link>
            </Button>
          }
        />
      );

    }
    const savedItems = page.data.map(renderSavedItem);
    return <div className="grid gap-4 p-4">{savedItems}</div>;

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
        className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary p-4"
      >
        <span className="text-sm text-secondary">
          {copy.range(
            page.total ? page.offset + 1 : 0,
            Math.min(page.total, page.offset + page.limit),
            page.total,
          )}
        </span>
        <div className="flex gap-2">
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
        >
          {renderSavedResults()}
          {renderPagination()}
        </DataPanel>
      </Page>
    );

  }

  return renderContent();

}
