'use client';
import { strings } from '@/strings';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { Button, Card, Field, Input, QueryBoundary } from '@/components/ui';
import {
  FeatureRequestMutationInputSchema,
  type FeatureRequest,
} from '@/models/featureRequest';
import {
  useDeleteFeatureRequest,
  useFeatureRequest,
  useUpdateFeatureRequest,
} from './hooks';
export function FeatureRequestDetailScreen({
  featureRequestId,
}: {
  featureRequestId: string;
}) {
  const query = useFeatureRequest(featureRequestId);
  return (
    <QueryBoundary
      query={query}
      retainDataOnError
      loadingFallback={
        <Card>
          {strings.ui.featureRequestDetailScreen.loadingFeatureRequest}
        </Card>
      }
    >
      {(request) => <FeatureRequestForm key={request.id} request={request} />}
    </QueryBoundary>
  );
}
function FeatureRequestForm({ request }: { request: FeatureRequest }) {
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
  const inputRef = useRef<HTMLInputElement>(null);
  useUnsavedFormGuard(dirtyRef, busyRef);
  const message = draft ?? request.message;
  const busy =
    confirmingDelete || updateMutation.isPending || deleteMutation.isPending;
  function change(value: string) {
    if (busyRef.current) return;
    if (draft === null) baseline.current = request.message;
    dirtyRef.current = value !== baseline.current;
    setDraft(dirtyRef.current ? value : null);
    setValidation(null);
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
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
          title: strings.ui.featureRequestDetailScreen.requestUpdated,
          intent: 'success',
        });
      },
      onSettled: () => {
        busyRef.current = false;
      },
    });
  }
  async function remove() {
    if (busyRef.current || confirmingRef.current) return;
    confirmingRef.current = true;
    busyRef.current = true;
    setConfirmingDelete(true);
    try {
      const confirmed = await presentation.showAlert({
        title: strings.ui.featureRequestDetailScreen.deleteThisRequest,
        description:
          strings.ui.featureRequestDetailScreen
            .thisRequestWillBeRemovedFromYourQueue,
        confirmLabel: strings.ui.featureRequestDetailScreen.deleteRequest,
        cancelLabel: strings.ui.featureRequestDetailScreen.keepRequest,
        tone: 'danger',
      });
      if (!confirmed) return;
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
  return (
    <Card className="grid gap-5">
      <div className="grid gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          {strings.ui.featureRequestDetailScreen.requestDetail}
        </p>
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-primary">
          {strings.ui.featureRequestDetailScreen.featureRequestDetail}
        </h1>
      </div>
      <form noValidate onSubmit={save} className="grid gap-3">
        <Field labelText={strings.ui.featureRequestDetailScreen.message}>
          <Input
            ref={inputRef}
            value={message}
            maxLength={1000}
            disabled={busy}
            aria-invalid={Boolean(validation)}
            aria-describedby={error ? 'feature-detail-error' : undefined}
            onChange={(event) => change(event.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={busy || draft === null}
            loading={updateMutation.isPending}
          >
            {strings.ui.featureRequestDetailScreen.saveChanges}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            loading={deleteMutation.isPending}
            onClick={() => void remove()}
          >
            {strings.ui.featureRequestDetailScreen.deleteRequest}
          </Button>
        </div>
        {error && (
          <p
            id="feature-detail-error"
            role="alert"
            className="text-sm text-error-primary"
          >
            {error}
          </p>
        )}
      </form>
    </Card>
  );
}
