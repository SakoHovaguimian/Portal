'use client';

import Link from 'next/link';

import {
  DataPanel,
  DataTable,
  EmptyState,
  ErrorState,
  InitialsAvatar,
  InlineLoading,
  MobileRecordRow,
  Page,
  PageHeader,
} from '@/components/ui';
import type { User } from '@/models';
import { strings } from '@/strings';

import { useUsers } from './hooks';
import type { UsersScreenProps } from './models/usersScreenProps';

export function UsersScreen({ query = '' }: UsersScreenProps) {

  const { data, isPending, isError, refetch } = useUsers(query);

  function renderHeader() {

    return (
      <PageHeader
        title={strings.ui.appShell.users}
        description={
          strings.ui.usersScreen.findPeopleInYourWorkspaceAndViewTheirProfilesHint
        }
      />
    );

  }

  function renderUserTable(users: User[]) {

    return (
      <DataTable
        embedded
        caption={strings.ui.usersScreen.userRecords}
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
              <time dateTime={row.createdAt}>
                {new Date(row.createdAt).toLocaleDateString()}
              </time>
            }
          />
        )}
        columns={[
          {
            key: 'name',
            header: strings.ui.usersScreen.name,
            render: (row) => (
              <Link
                className="font-medium text-primary hover:text-brand-secondary"
                href={`/users/${row.id}`}
              >
                {row.firstName} {row.lastName}
              </Link>
            ),
          },
          {
            key: 'email',
            header: strings.ui.usersScreen.email,
            render: (row) => row.email,
          },
          {
            key: 'createdAt',
            header: strings.ui.usersScreen.created,
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
          },
        ]}
        rows={users}
      />
    );

  }

  function renderDirectoryResults() {

    return isPending ? (
      <div className="p-6">
        <InlineLoading message={strings.ui.usersScreen.loadingUsers} />
      </div>
    ) : isError || !data ? (
      <div className="p-4">
        <ErrorState
          title={strings.ui.usersScreen.usersUnavailable}
          description={strings.ui.usersScreen.weCouldNotLoadUsersRightNowHint}
          onRetry={() => void refetch()}
        />
      </div>
    ) : data.data.length === 0 ? (
      <EmptyState
        variant="plain"
        title={strings.ui.usersScreen.noUsersFound}
        description={strings.ui.usersScreen.tryADifferentSearchHint}
      />
    ) : (
      renderUserTable(data.data)
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        <DataPanel>{renderDirectoryResults()}</DataPanel>
      </Page>
    );

  }

  return renderContent();

}
