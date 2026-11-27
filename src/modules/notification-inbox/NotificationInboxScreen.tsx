'use client';

import { useEffect } from 'react';

// Shared UI
import { MutationError } from '@/components/MutationError';
import {
  Button,
  DataPanel,
  DataPanelState,
  DirectoryPagination,
  EmptyState,
  InlineLoading,
  Page,
  PageHeader,
  QueryBoundary,
  UiIcon,
  buttonClassName,
} from '@/components/ui';
import { NavigationLink } from '@/components/ui/components/NavigationLink';

// Shared Services And Copy
import { useNavigationGuard } from '@/providers/NavigationGuardProvider';
import { NotificationControls } from '@/services/notifications/components/NotificationControls';
import { portalNotificationInboxStrings as copy } from '@/strings';

// Inbox Components
import styles from './NotificationInbox.module.css';
import { NotificationInboxSummary } from './components/NotificationInboxSummary';
import { NotificationInboxToolbar } from './components/NotificationInboxToolbar';
import { NotificationRecord } from './components/NotificationRecord';

// Inbox Hooks And Models
import { useNotificationInbox, useNotificationCounts } from './hooks';
import type { NotificationInboxItem } from './models/notificationInboxItem';
import { notificationInboxFilters } from './notificationInboxQueryParams';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationDirectory } from './useNotificationDirectory';

export function NotificationInboxScreen() {

  const directory = useNotificationDirectory();
  const query = useNotificationInbox(directory.query);
  const filters = notificationInboxFilters(directory.query);
  const counts = useNotificationCounts({
    query: filters.query,
    category: filters.category,
  });
  const allCounts = useNotificationCounts();
  const filtered = Object.values(filters).some((value) => value !== undefined);
  const searched = Boolean(filters.query || filters.category);
  const actions = useNotificationActions(filters);
  const { confirmNavigation } = useNavigationGuard();
  useEffect(() => {

    if (
      query.isSuccess &&
      !query.isFetching &&
      query.data.data.length === 0 &&
      directory.query.offset > 0
    ) { directory.setOffset(0); }

  }, [query.isSuccess, query.isFetching, query.data, directory]);

  function renderHeader() {

    return (
      <PageHeader
        title={copy.title}
        description={copy.description}
        meta={
          <NotificationInboxSummary
            counts={counts.data}
            unavailable={counts.isError}
            filtered={searched}
          />
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              loading={actions.busy}
              disabled={!allCounts.data?.unreadCount || allCounts.isError}
              onClick={actions.markAllRead}
            >
              <UiIcon name="check" className="size-4" />
              {copy.markAllReadAction}
            </Button>
            <NavigationLink
              href="/settings/notifications"
              beforeNavigate={confirmNavigation}
              className={buttonClassName('ghost')}
            >
              <UiIcon name="settings" />
              {copy.settingsAction}
            </NavigationLink>
          </div>
        }
      />
    );

  }

  function renderNotificationRow(item: NotificationInboxItem) {

    return (
      <li key={item.id} className="min-w-0">
        <NotificationRecord
          item={item}
          busy={actions.busy}
          onRead={actions.readItem}
          onArchive={actions.archiveItem}
        />
      </li>
    );

  }

  function renderNotificationList(items: NotificationInboxItem[]) {

    const notificationRows = items.map(renderNotificationRow);
    return (
      <ul role="list" className={styles.records}>
        {notificationRows}
      </ul>
    );

  }

  function renderEmptyState() {

    return (
      <EmptyState
        variant="plain"
        title={filtered ? copy.noResultsTitle : copy.emptyTitle}
        description={filtered ? copy.noResultsHint : copy.emptyHint}
        action={
          filtered && (
            <Button onClick={directory.clearFilters}>
              {copy.clearFiltersAction}
            </Button>
          )
        }
      />
    );

  }

  function renderResults() {

    return (
      <section
        id="notification-results"
        aria-label={copy.resultsLabel}
        className="min-w-0"
      >
        <QueryBoundary
          query={query}
          inset
          loadingFallback={
            <DataPanelState>
              <InlineLoading message={copy.loadingTitle} />
            </DataPanelState>
          }
        >
          {(result) =>
            result.data.length
              ? renderNotificationList(result.data)
              : renderEmptyState()
          }
        </QueryBoundary>
      </section>
    );

  }

  function renderToolbar() {

    return (
      <NotificationInboxToolbar
        query={directory.query}
        counts={counts.isError ? undefined : counts.data}
        filtered={filtered}
        busy={actions.busy}
        hasNotifications={!query.isFetching && Boolean(query.data?.data.length)}
        update={directory.update}
        onReadAll={actions.readAll}
        onArchiveAll={actions.archiveAll}
      />
    );

  }

  function renderPagination() {

    if (!query.data || (!query.data.data.length && !query.data.page.offset)) { return null; }
    return (
      <DirectoryPagination
        page={query.data.page}
        count={query.data.data.length}
        busy={query.isFetching || actions.busy}
        label={copy.paginationLabel}
        range={copy.rangeLabel}
        onNavigate={directory.setOffset}
      />
    );

  }

  function renderInboxContent() {

    return (
      <DataPanel
        busy={query.isFetching || actions.busy}
        busyLabel={copy.loadingTitle}
        toolbar={renderToolbar()}
        footer={renderPagination()}
      >
        {actions.error && (
          <div className="px-4 pt-4 sm:px-6">
            <MutationError error={actions.error} />
          </div>
        )}
        {renderResults()}
      </DataPanel>
    );

  }

  return (
    <Page>
      {renderHeader()}
      {renderInboxContent()}
      <div className={styles.browserControls}>
        <NotificationControls />
      </div>
    </Page>
  );

}
