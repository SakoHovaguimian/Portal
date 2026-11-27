'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

import {
  Button,
  DataPanel,
  DataPanelState,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
  Input,
  InlineLoading,
  MobileRecordRow,
  Page,
  PageHeader,
  UiIcon,
} from '@/components/ui';
import { FeatureRequestMutationInputSchema } from '@/models/featureRequest';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { strings } from '@/strings';

import { useCreateFeatureRequest, useFeatureRequests } from './hooks';
import type { FeatureRequestsScreenProps } from './models/featureRequestsScreenProps';

export function FeatureRequestsScreen({ query = '' }: FeatureRequestsScreenProps) {

  const { data, isPending, isFetching, isError, refetch } = useFeatureRequests(query);
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
            .shareIdeasForImprovingYourWorkspaceAndFollowYourHint
        }
      />
    );

  }

  function renderCreateRequestForm() {

    return (
      <form noValidate onSubmit={handleSubmit} className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Field className="min-w-0" labelText={strings.ui.featureRequestsScreen.newFeatureRequest}>
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
              strings.ui.featureRequestsScreen.describeTheWorkflowGapOrIdeaHint
            }
          />
        </Field>
        <Button
          type="submit"
          disabled={!message.trim() || createMutation.isPending}
          loading={createMutation.isPending}
        >
          <UiIcon name="plus" />
          {strings.ui.featureRequestsScreen.createRequest}
        </Button>
        {(validation || createMutation.isError) && (
          <p
            id="feature-create-error"
            role="alert"
            className="m-0 text-sm text-error-primary sm:col-span-full"
          >
            {validation ?? createMutation.error?.message}
          </p>
        )}
      </form>
    );

  }

  function renderLoadingState() {

    return isPending ? (
      <DataPanelState>
        <div className="grid place-items-center">
          <InlineLoading message={strings.ui.featureRequestsScreen.loadingFeatureRequests} />
        </div>
      </DataPanelState>
    ) : null;

  }

  function renderErrorState() {

    return isError ? (
      <DataPanelState>
        <ErrorState
          title={strings.ui.featureRequestsScreen.featureRequestsUnavailable}
          description={strings.ui.featureRequestsScreen.weCouldNotLoadTheRequestQueueHint}
          onRetry={() => void refetch()}
        />
      </DataPanelState>
    ) : null;

  }

  function renderEmptyState() {

    return data && data.data.length === 0 ? (
      <EmptyState
        variant="plain"
        title={strings.ui.featureRequestsScreen.noRequestsYet}
        description={
          strings.ui.featureRequestsScreen
            .createTheFirstFeatureRequestToSeedTheWorkflowHint
        }
      />
    ) : null;

  }

  function renderFeatureRequestsTable() {

    return data && data.data.length > 0 ? (
      <DataTable
        embedded
        caption={strings.ui.featureRequestsScreen.featureRequestQueue}
        getRowKey={(row) => row.id}
        getRowHref={(row) => `/feature-requests/${row.id}`}
        renderMobileRow={(row) => (
          <MobileRecordRow
            title={
              <Link href={`/feature-requests/${row.id}`}>{row.message}</Link>
            }
            footer={
              <time dateTime={row.updatedAt} className="text-xs text-tertiary tabular-nums">
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
                className="font-medium text-primary wrap-anywhere hover:text-brand-secondary"
                href={`/feature-requests/${row.id}`}
              >
                {row.message}
              </Link>
            ),
          },
          {
            key: 'updatedAt',
            header: strings.ui.featureRequestsScreen.updated,
            headerClassName: 'text-end',
            cellClassName: 'w-48 text-end tabular-nums',
            render: (row) => <time dateTime={row.updatedAt}>{new Date(row.updatedAt).toLocaleString()}</time>,
          },
        ]}
        rows={data.data}
      />
    ) : null;

  }

  function renderRequestResults() {

    return (
      <section aria-labelledby="request-queue-title">
        <h2 id="request-queue-title" className="m-0 border-b-control border-secondary px-4 py-4 text-base font-semibold text-primary sm:px-6">
          {strings.ui.featureRequestsScreen.featureRequestQueue}
        </h2>
        {renderLoadingState()}
        {renderErrorState()}
        {renderEmptyState()}
        {renderFeatureRequestsTable()}
      </section>
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        <DataPanel
          toolbar={renderCreateRequestForm()}
          busy={isFetching && !isPending}
          busyLabel={strings.ui.featureRequestsScreen.loadingFeatureRequests}
        >
          {renderRequestResults()}
        </DataPanel>
      </Page>
    );

  }

  return renderContent();

}
