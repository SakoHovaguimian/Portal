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
    <div className="grid gap-4">
      <Card className="grid gap-4">
        <div className="grid gap-2">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Intake</p>
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">Feature request queue</h2>
          <p className="m-0 text-sm leading-6 text-secondary">Capture workflow gaps in a simple flat form, then triage them below in the same dashboard language as the rest of the app.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Field labelText="New feature request">
            <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the workflow gap or idea" />
          </Field>
          <Button type="submit" disabled={!message || createMutation.isPending} className="w-full sm:w-auto">
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
              render: (row) => <Link className="font-medium text-primary hover:text-brand-secondary" href={`/feature-requests/${row.id}`}>{row.message}</Link>,
            },
            { key: 'updatedAt', header: 'Updated', render: (row) => new Date(row.updatedAt).toLocaleString() },
          ]}
          rows={data.data}
        />
      ) : null}
    </div>
  );
}
