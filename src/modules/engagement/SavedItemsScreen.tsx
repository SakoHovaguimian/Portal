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
import type { SavedQuery } from './models/savedQuery';
import type { EngagementRecord } from './models/engagementRecord';
export function SavedItemsScreen({ query }: { query: SavedQuery }) {
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
    if (confirming || remove.isPending) return;
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
      )
        return;
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
  return (
    <Page>
      <PageHeader title={copy.title} description={copy.description} />
      {failure && (
        <Message
          intent="danger"
          title={copy.errorTitle}
          description={failure}
        />
      )}
      <DataPanel
        busy={records.isFetching}
        busyLabel={copy.loading}
        toolbar={
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
        }
      >
        <QueryBoundary query={records} loadingMessage={copy.loading} inset>
          {(page) =>
            page.data.length ? (
              <div className="grid gap-4 p-4">
                {page.data.map((record) => (
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
                ))}
              </div>
            ) : (
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
            )
          }
        </QueryBoundary>
        {records.data && (
          <nav
            aria-label={copy.paginationLabel}
            className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary p-4"
          >
            <span className="text-sm text-secondary">
              {copy.range(
                records.data.total ? records.data.offset + 1 : 0,
                Math.min(
                  records.data.total,
                  records.data.offset + records.data.limit,
                ),
                records.data.total,
              )}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={records.isFetching || records.data.offset === 0}
                onClick={() =>
                  navigate({
                    ...query,
                    offset: Math.max(0, records.data!.offset - query.limit),
                  })
                }
              >
                {copy.previous}
              </Button>
              <Button
                variant="secondary"
                disabled={
                  records.isFetching ||
                  records.data.offset + records.data.limit >= records.data.total
                }
                onClick={() =>
                  navigate({
                    ...query,
                    offset: records.data!.offset + query.limit,
                  })
                }
              >
                {copy.next}
              </Button>
            </div>
          </nav>
        )}
      </DataPanel>
    </Page>
  );
}
