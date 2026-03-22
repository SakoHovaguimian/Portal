'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, DataTable, EmptyState, ErrorState, Field, Input } from '@semantic-web/ui';
import { useCreateFeatureRequest, useFeatureRequests } from './hooks';

export function FeatureRequestsScreen({ query = '' }: { query?: string }) {
  const { data, isPending, isError, refetch } = useFeatureRequests(query);
  const createMutation = useCreateFeatureRequest();
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createMutation.mutateAsync({ message });
    setMessage('');
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <Field labelText="New feature request">
            <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the workflow gap or idea" />
          </Field>
          <Button type="submit" disabled={!message || createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Create request'}
          </Button>
        </form>
      </Card>
      {isPending ? <Card>Loading feature requests...</Card> : null}
      {isError ? <ErrorState title="Feature requests unavailable" description="We could not load the request queue." onRetry={() => void refetch()} /> : null}
      {data && data.data.length === 0 ? (
        <EmptyState title="No requests yet" description="Create the first feature request to seed the workflow." />
      ) : null}
      {data && data.data.length > 0 ? (
        <DataTable
          columns={[
            {
              key: 'message',
              header: 'Message',
              render: (row) => <Link href={`/feature-requests/${row.id}`}>{row.message}</Link>,
            },
            { key: 'updatedAt', header: 'Updated', render: (row) => new Date(row.updatedAt).toLocaleString() },
          ]}
          rows={data.data}
        />
      ) : null}
    </div>
  );
}
