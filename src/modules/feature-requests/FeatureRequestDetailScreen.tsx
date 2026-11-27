'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Card, DescriptionList, Field, FormActions, InlineLoading, Page, PageHeader, QueryBoundary, TextArea, UiIcon } from '@/components/ui';
import { FeatureRequestMutationInputSchema } from '@/models/featureRequest';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useGuardedBack } from '@/providers/useGuardedBack';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { strings } from '@/strings';

import {
  useDeleteFeatureRequest,
  useFeatureRequest,
  useUpdateFeatureRequest,
} from './hooks';
import type { FeatureRequestDetailScreenProps } from './models/featureRequestDetailScreenProps';
import type { FeatureRequestFormProps } from './models/featureRequestFormProps';

const copy = strings.ui.featureRequestDetailScreen;

export function FeatureRequestDetailScreen({
  featureRequestId,
}: FeatureRequestDetailScreenProps) {

  const featureRequestQuery = useFeatureRequest(featureRequestId);
  const back = useGuardedBack('/feature-requests');

  return (
    <Page>
      <div>
        <Button variant="ghost" onClick={() => void back()}>
          <UiIcon name="chevronLeft" />
          {copy.backToRequests}
        </Button>
      </div>
      <PageHeader title={copy.featureRequestDetail} />
      <QueryBoundary
        query={featureRequestQuery}
        retainDataOnError
        loadingFallback={<Card><InlineLoading message={copy.loadingFeatureRequest} /></Card>}
      >
        {(request) => <FeatureRequestForm key={request.id} request={request} />}
      </QueryBoundary>
    </Page>
  );

}

function FeatureRequestForm({ request }: FeatureRequestFormProps) {

  const router = useRouter();
  const presentation = usePresentationService();
  const updateMutation = useUpdateFeatureRequest(request.id);
  const deleteMutation = useDeleteFeatureRequest(request.id);
  const [draft, setDraft] = useState<string | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const baseline = useRef(request.message);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  const confirmingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useUnsavedFormGuard(dirtyRef, busyRef);
  const message = draft ?? request.message;
  const busy =
    confirmingDelete || updateMutation.isPending || deleteMutation.isPending;

  function handleMessageChange(value: string) {

    if (busyRef.current) {
      return;
    }

    if (draft === null) {
      baseline.current = request.message;
    }

    dirtyRef.current = value !== baseline.current;
    setDraft(dirtyRef.current ? value : null);
    setValidation(null);

  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

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

    busyRef.current = true;
    setValidation(null);
    updateMutation.mutate(parsed.data, {
      onSuccess: () => {

        dirtyRef.current = false;
        busyRef.current = false;
        setDraft(null);
        void presentation.showToast({
          title: copy.requestUpdated,
          intent: 'success',
        });

      },
      onSettled: () => {
        busyRef.current = false;
      },
    });

  }

  async function handleDeleteRequest() {

    if (busyRef.current || confirmingRef.current) {
      return;
    }

    confirmingRef.current = true;
    busyRef.current = true;
    setConfirmingDelete(true);

    try {

      const confirmed = await presentation.showAlert({
        title: copy.deleteThisRequest,
        description: copy.thisRequestWillBeRemovedFromYourQueueHint,
        confirmLabel: copy.deleteRequest,
        cancelLabel: copy.keepRequest,
        tone: 'danger',
      });

      if (!confirmed) {
        return;
      }

      await deleteMutation.mutateAsync();
      dirtyRef.current = false;
      busyRef.current = false;
      setDraft(null);
      router.push('/feature-requests');

    } catch {
      /* Failed deletion preserves the current draft and exposes the mutation error. */
    } finally {

      confirmingRef.current = false;
      busyRef.current = false;
      setConfirmingDelete(false);

    }

  }

  const error =
    validation ??
    updateMutation.error?.message ??
    deleteMutation.error?.message;

  function renderForm() {

    return (
      <form noValidate onSubmit={handleSubmit} className="grid min-w-0 content-start gap-5 p-(--space-panel)">
        <Field labelText={copy.message}>
          <TextArea
            ref={inputRef}
            value={message}
            maxLength={1000}
            rows={4}
            disabled={busy}
            aria-invalid={Boolean(validation)}
            aria-describedby={error ? 'feature-detail-error' : undefined}
            onChange={(event) => handleMessageChange(event.target.value)}
          />
        </Field>
        {error && (
          <p
            id="feature-detail-error"
            role="alert"
            className="m-0 text-sm text-error-primary"
          >
            {error}
          </p>
        )}
        <FormActions variant="inline">
          <Button
            type="submit"
            disabled={busy || draft === null}
            loading={updateMutation.isPending}
          >
            {copy.saveChanges}
          </Button>
        </FormActions>
      </form>
    );

  }

  function renderRequestDetails() {

    return (
      <aside aria-labelledby="request-details-title" className="grid min-w-0 content-start gap-4 border-t-control border-secondary bg-secondary_subtle p-(--space-panel) xl:border-s-control xl:border-t-0">
        <h2 id="request-details-title" className="m-0 text-base font-semibold text-primary">{copy.requestDetails}</h2>
        <DescriptionList
          layout="rows"
          items={[
            { label: copy.created, value: <time dateTime={request.createdAt} className="tabular-nums">{new Date(request.createdAt).toLocaleString()}</time> },
            { label: copy.updated, value: <time dateTime={request.updatedAt} className="tabular-nums">{new Date(request.updatedAt).toLocaleString()}</time> },
          ]}
        />
        <div className="border-t-control border-secondary pt-4">
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            loading={deleteMutation.isPending}
            onClick={() => void handleDeleteRequest()}
          >
            {copy.deleteRequest}
          </Button>
        </div>
      </aside>
    );

  }

  function renderContent() {

    return (
      <Card className="grid max-w-6xl overflow-hidden p-0 shadow-none xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)]">
        {renderForm()}
        {renderRequestDetails()}
      </Card>
    );

  }

  return renderContent();

}
