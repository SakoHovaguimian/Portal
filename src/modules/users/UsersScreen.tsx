'use client';

import Link from 'next/link';

import {
  DataPanel,
  DataPanelState,
  DataTable,
  DirectoryFilters,
  EmptyState,
  ErrorState,
  InitialsAvatar,
  InlineLoading,
  MobileRecordRow,
  Page,
  PageHeader,
} from '@/components/ui';
import type { User } from '@/models';
import { useDirectoryState } from '@/queries/useDirectoryState';
import { strings } from '@/strings';

import { useUsers } from './hooks';

const copy = strings.ui.usersScreen;

export function UsersScreen() {

  const directory = useDirectoryState();
  const { data, isPending, isFetching, isError, refetch } = useUsers(directory.query);

  function renderHeader() {

    return (
      <PageHeader
        title={strings.ui.appShell.users}
        description={copy.findPeopleInYourWorkspaceAndViewTheirProfilesHint}
      />
    );

  }

  function renderFilters() {

    return (
      <DirectoryFilters
        id="users-search"
        value={{ query: directory.query }}
        statuses={[]}
        showStatus={false}
        onChange={(value) => directory.update({ query: value.query || undefined })}
        copy={{
          search: copy.searchLabel,
          placeholder: copy.searchPlaceholder,
          clear: copy.clearSearch,
          status: '',
          allStatuses: '',
        }}
      />
    );

  }

  function renderUserTable(users: User[]) {

    return (
      <DataTable
        embedded
        caption={copy.userRecords}
        getRowKey={(row) => row.id}
        getRowHref={(row) => `/users/${row.id}`}
        renderMobileRow={(row) => (
          <MobileRecordRow
            title={
              <Link href={`/users/${row.id}`}>
                {row.firstName} {row.lastName}
              </Link>
            }
            leading={<InitialsAvatar name={`${row.firstName} ${row.lastName}`} />}
            description={row.email}
            footer={
              <time dateTime={row.createdAt} className="text-xs text-tertiary tabular-nums">
                {new Date(row.createdAt).toLocaleDateString()}
              </time>
            }
          />
        )}
        columns={[
          {
            key: 'name',
            header: copy.name,
            render: (row) => (
              <Link
                className="inline-flex min-w-0 items-center gap-3 font-medium text-primary hover:text-brand-secondary"
                href={`/users/${row.id}`}
              >
                <InitialsAvatar name={`${row.firstName} ${row.lastName}`} />
                <span className="wrap-anywhere">{row.firstName} {row.lastName}</span>
              </Link>
            ),
          },
          {
            key: 'email',
            header: copy.email,
            cellClassName: 'wrap-anywhere',
            render: (row) => row.email,
          },
          {
            key: 'createdAt',
            header: copy.created,
            headerClassName: 'text-end',
            cellClassName: 'text-end tabular-nums',
            render: (row) => <time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleDateString()}</time>,
          },
        ]}
        rows={users}
      />
    );

  }

  function renderDirectoryResults() {

    return isPending ? (
      <DataPanelState>
        <div className="grid place-items-center">
          <InlineLoading message={copy.loadingUsers} />
        </div>
      </DataPanelState>
    ) : isError || !data ? (
      <DataPanelState>
        <ErrorState
          title={copy.usersUnavailable}
          description={copy.weCouldNotLoadUsersRightNowHint}
          onRetry={() => void refetch()}
        />
      </DataPanelState>
    ) : data.data.length === 0 ? (
      <EmptyState
        variant="plain"
        title={copy.noUsersFound}
        description={copy.tryADifferentSearchHint}
      />
    ) : (
      renderUserTable(data.data)
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        <DataPanel toolbar={renderFilters()} busy={isFetching && !isPending} busyLabel={copy.loadingUsers}>
          {renderDirectoryResults()}
        </DataPanel>
      </Page>
    );

  }

  return renderContent();

}
