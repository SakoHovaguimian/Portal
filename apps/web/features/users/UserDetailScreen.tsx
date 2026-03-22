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
    <Card>
      <h2>{data.firstName} {data.lastName}</h2>
      <p>{data.email}</p>
      <p>External ID: {data.externalId}</p>
      <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
    </Card>
  );
}
