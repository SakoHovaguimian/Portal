'use client';

import Link from 'next/link';
import { useUsers } from './hooks';
import { DataTable, EmptyState, ErrorState, Card } from '@semantic-web/ui';

export function UsersScreen({ query = '' }: { query?: string }) {
  const { data, isPending, isError, refetch } = useUsers(query);

  if (isPending) {
    return <Card>Loading users...</Card>;
  }

  if (isError || !data) {
    return <ErrorState title="Users unavailable" description="We could not load users right now." onRetry={() => void refetch()} />;
  }

  if (data.data.length === 0) {
    return <EmptyState title="No users found" description="Adjust the query or seed additional mock records." />;
  }

  return (
    <DataTable
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (row) => (
            <Link href={`/users/${row.id}`}>
              {row.firstName} {row.lastName}
            </Link>
          ),
        },
        { key: 'email', header: 'Email', render: (row) => row.email },
        { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
      ]}
      rows={data.data}
    />
  );
}
