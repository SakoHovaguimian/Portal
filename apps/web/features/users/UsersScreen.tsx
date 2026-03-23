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
    <div className="grid gap-4">
      <Card className="grid gap-2">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Directory</p>
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">User records</h2>
        <p className="m-0 text-sm leading-6 text-secondary">Browse canonical users in the same flatter table treatment used across the dashboard.</p>
      </Card>
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row) => (
              <Link className="font-medium text-primary hover:text-brand-secondary" href={`/users/${row.id}`}>
                {row.firstName} {row.lastName}
              </Link>
            ),
          },
          { key: 'email', header: 'Email', render: (row) => row.email },
          { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        ]}
        rows={data.data}
      />
    </div>
  );
}
