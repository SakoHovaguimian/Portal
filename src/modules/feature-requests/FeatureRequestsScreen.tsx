'use client';

import { strings } from '@/strings';
import { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
  Input,
} from '@/components/ui';
import { useCreateFeatureRequest, useFeatureRequests } from './hooks';

export function FeatureRequestsScreen({ query = '' }: { query?: string }) {
  const { data, isPending, isError, refetch } = useFeatureRequests(query);
  const createMutation = useCreateFeatureRequest();
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createMutation.isPending || !message.trim()) return;
    createMutation.mutate({ message }, { onSuccess: () => setMessage('') });
  }

  return (
    <div className="grid gap-4">
      <Card className="grid gap-4">
        <div className="grid gap-2">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">
            {strings.ui.featureRequestsScreen.intake}
          </p>
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">
            {strings.ui.featureRequestsScreen.featureRequestQueue}
          </h2>
          <p className="m-0 text-sm leading-6 text-secondary">
            {
              strings.ui.featureRequestsScreen
                .shareIdeasForImprovingYourWorkspaceAndFollowYour
            }
          </p>
        </div>
        <form noValidate onSubmit={handleSubmit} className="grid gap-3">
          <Field labelText={strings.ui.featureRequestsScreen.newFeatureRequest}>
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                strings.ui.featureRequestsScreen.describeTheWorkflowGapOrIdea
              }
            />
          </Field>
          <Button
            type="submit"
            disabled={!message.trim() || createMutation.isPending}
            className="w-full sm:w-auto"
          >
            {createMutation.isPending
              ? strings.common.saving
              : strings.ui.featureRequestsScreen.createRequest}
          </Button>
          {createMutation.isError && (
            <p role="alert" className="text-sm text-error-primary">
              {createMutation.error.message}
            </p>
          )}
        </form>
      </Card>
      {isPending ? (
        <Card>{strings.ui.featureRequestsScreen.loadingFeatureRequests}</Card>
      ) : null}
      {isError ? (
        <ErrorState
          title={strings.ui.featureRequestsScreen.featureRequestsUnavailable}
          description={
            strings.ui.featureRequestsScreen.weCouldNotLoadTheRequestQueue
          }
          onRetry={() => void refetch()}
        />
      ) : null}
      {data && data.data.length === 0 ? (
        <EmptyState
          title={strings.ui.featureRequestsScreen.noRequestsYet}
          description={
            strings.ui.featureRequestsScreen
              .createTheFirstFeatureRequestToSeedTheWorkflow
          }
        />
      ) : null}
      {data && data.data.length > 0 ? (
        <DataTable
          columns={[
            {
              key: 'message',
              header: strings.ui.featureRequestsScreen.message,
              render: (row) => (
                <Link
                  className="font-medium text-primary hover:text-brand-secondary"
                  href={`/feature-requests/${row.id}`}
                >
                  {row.message}
                </Link>
              ),
            },
            {
              key: 'updatedAt',
              header: strings.ui.featureRequestsScreen.updated,
              render: (row) => new Date(row.updatedAt).toLocaleString(),
            },
          ]}
          rows={data.data}
        />
      ) : null}
    </div>
  );
}
