'use client';

import { strings } from '@/strings';
import { useRef, useState } from 'react';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { FeatureRequestMutationInputSchema } from '@/models/featureRequest';
import Link from 'next/link';
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
  Input,
  Page,
  PageHeader,
  MobileRecordRow,
} from '@/components/ui';
import { useCreateFeatureRequest, useFeatureRequests } from './hooks';
import type { FeatureRequestsScreenProps } from './models/featureRequestsScreenProps';

export function FeatureRequestsScreen({ query = '' }: FeatureRequestsScreenProps) {

  const { data, isPending, isError, refetch } = useFeatureRequests(query);
  const createMutation = useCreateFeatureRequest();
  const [message, setMessage] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useUnsavedFormGuard(dirtyRef, busyRef);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (busyRef.current) {
      return;
    }
    const parsed = FeatureRequestMutationInputSchema.safeParse({ message });
    if (!parsed.success) {

      setValidation(strings.errors.invalidInput);
      inputRef.current?.focus();
      return;

    }
    setValidation(null);
    busyRef.current = true;
    createMutation.mutate(parsed.data, {
      onSuccess: () => {

        dirtyRef.current = false;
        busyRef.current = false;
        setMessage('');

      },
      onSettled: () => {
        busyRef.current = false;
      },
    });

  }

  function renderHeader() {

    return (
      <PageHeader
        title={strings.ui.appShell.featureRequests}
        description={
          strings.ui.featureRequestsScreen
            .shareIdeasForImprovingYourWorkspaceAndFollowYour
        }
      />
    );

  }

  function renderCreateRequestForm() {

    return (
      <Card className="grid gap-4">
        <form noValidate onSubmit={handleSubmit} className="grid gap-3">
          <Field labelText={strings.ui.featureRequestsScreen.newFeatureRequest}>
            <Input
              ref={inputRef}
              value={message}
              maxLength={1000}
              disabled={createMutation.isPending}
              aria-invalid={Boolean(validation)}
              aria-describedby={
                validation || createMutation.isError
                  ? 'feature-create-error'
                  : undefined
              }
              onChange={(event) => {

                dirtyRef.current = event.target.value.length > 0;
                setMessage(event.target.value);
                setValidation(null);

              }}
              placeholder={
                strings.ui.featureRequestsScreen.describeTheWorkflowGapOrIdea
              }
            />
          </Field>
          <Button
            type="submit"
            disabled={!message.trim() || createMutation.isPending}
            loading={createMutation.isPending}
            className="w-full sm:w-auto"
          >
            {strings.ui.featureRequestsScreen.createRequest}
          </Button>
          {(validation || createMutation.isError) && (
            <p
              id="feature-create-error"
              role="alert"
              className="text-sm text-error-primary"
            >
              {validation ?? createMutation.error?.message}
            </p>
          )}
        </form>
      </Card>
    );

  }

  function renderLoadingState() {

    return isPending ? (
      <Card>{strings.ui.featureRequestsScreen.loadingFeatureRequests}</Card>
    ) : null;

  }

  function renderErrorState() {

    return isError ? (
      <ErrorState
        title={strings.ui.featureRequestsScreen.featureRequestsUnavailable}
        description={
          strings.ui.featureRequestsScreen.weCouldNotLoadTheRequestQueue
        }
        onRetry={() => void refetch()}
      />
    ) : null;

  }

  function renderEmptyState() {

    return data && data.data.length === 0 ? (
      <EmptyState
        title={strings.ui.featureRequestsScreen.noRequestsYet}
        description={
          strings.ui.featureRequestsScreen
            .createTheFirstFeatureRequestToSeedTheWorkflow
        }
      />
    ) : null;

  }

  function renderFeatureRequestsTable() {

    return data && data.data.length > 0 ? (
      <DataTable
        caption={strings.ui.featureRequestsScreen.featureRequestQueue}
        getRowKey={(row) => row.id}
        getRowHref={(row) => `/feature-requests/${row.id}`}
        renderMobileRow={(row) => (
          <MobileRecordRow
            title={
              <Link href={`/feature-requests/${row.id}`}>{row.message}</Link>
            }
            footer={
              <time dateTime={row.updatedAt}>
                {new Date(row.updatedAt).toLocaleString()}
              </time>
            }
          />
        )}
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
    ) : null;

  }

  function renderRequestResults() {

    return (
      <>
        {renderLoadingState()}
        {renderErrorState()}
        {renderEmptyState()}
        {renderFeatureRequestsTable()}
      </>
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        {renderCreateRequestForm()}
        {renderRequestResults()}
      </Page>
    );

  }

  return renderContent();

}
