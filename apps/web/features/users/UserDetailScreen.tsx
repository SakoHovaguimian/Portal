'use client';

import { Card, EmptyState, ErrorState } from '@semantic-web/ui';
import { useUser } from './hooks';

export function UserDetailScreen({ userId }: { userId: string }) {
  const { data, isPending, isError, refetch } = useUser(userId);

  if (isPending) {
    return <Card>Loading user profile...</Card>;
  }

  if (isError) {
    return <ErrorState title="User unavailable" description="We could not load this user profile." onRetry={() => void refetch()} />;
  }

  if (!data) {
    return <EmptyState title="Missing user" description="This user record could not be found." />;
  }

  return (
    <Card className="grid gap-4">
      <div className="grid gap-2">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">User detail</p>
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">
          {data.firstName} {data.lastName}
        </h2>
      </div>
      <div className="grid gap-3 rounded-xl border border-secondary bg-secondary_subtle p-4 text-sm text-secondary">
        <p className="m-0"><span className="font-semibold text-primary">Email:</span> {data.email}</p>
        <p className="m-0"><span className="font-semibold text-primary">External ID:</span> {data.externalId}</p>
        <p className="m-0"><span className="font-semibold text-primary">Created:</span> {new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </Card>
  );
}
