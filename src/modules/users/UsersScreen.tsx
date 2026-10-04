'use client';

import { strings } from '@/strings';
import Link from 'next/link';
import { useUsers } from './hooks';
import { DataTable, EmptyState, ErrorState, Card } from '@/components/ui';

export function UsersScreen({ query = '' }: { query?: string }) {
  const { data, isPending, isError, refetch } = useUsers(query);

  if (isPending) {
    return <Card>{strings.ui.usersScreen.loadingUsers}</Card>;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title={strings.ui.usersScreen.usersUnavailable}
        description={strings.ui.usersScreen.weCouldNotLoadUsersRightNow}
        onRetry={() => void refetch()}
      />
    );
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        title={strings.ui.usersScreen.noUsersFound}
        description={strings.ui.usersScreen.tryADifferentSearch}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="grid gap-2">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          {strings.ui.usersScreen.directory}
        </p>
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">
          {strings.ui.usersScreen.userRecords}
        </h2>
        <p className="m-0 text-sm leading-6 text-secondary">
          {strings.ui.usersScreen.findPeopleInYourWorkspaceAndViewTheirProfiles}
        </p>
      </Card>
      <DataTable
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
        rows={data.data}
      />
    </div>
  );
}
