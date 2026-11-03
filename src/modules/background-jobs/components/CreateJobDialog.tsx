'use client';

import { useRef, useState } from 'react';
import { Button, Checkbox, Field, Input, Modal, Select } from '@/components/ui';
import { MutationError } from '@/components/MutationError';
import { portalJobStrings as copy } from '@/strings';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useBackgroundJobMutations } from '../hooks';
import { BackgroundJobCreateInputSchema } from '../models/backgroundJob';
import type { CreateJobDialogProps } from '../models/createJobDialogProps';
import { sampleJobTypes } from '../models/sampleJobType';

export function CreateJobDialog({ onDismiss, onCreated }: CreateJobDialogProps) {

  const [name, setName] = useState('');
  const [type, setType] = useState<string>(sampleJobTypes.report);
  const [failFirstAttempt, setFailFirstAttempt] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dirty = useRef(false);
  const busy = useRef(false);
  const request = useRef<{ signature: string; key: string } | null>(null);
  const requestLeave = useUnsavedFormGuard(dirty, busy);
  const { create } = useBackgroundJobMutations();
  const presentation = usePresentationService();

  async function dismiss() {

    if (await requestLeave()) { onDismiss(); }

  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (busy.current) { return; }
    const signature = JSON.stringify({ name: name.trim(), type, failFirstAttempt });
    if (!request.current || request.current.signature !== signature) { request.current = { signature, key: crypto.randomUUID() }; }
    const input = BackgroundJobCreateInputSchema.safeParse({ name: name.trim(), type, payload: { failFirstAttempt }, idempotencyKey: request.current.key });
    if (!input.success) {

      setValidation(copy.errors.invalidInput);
      inputRef.current?.focus();
      return;

    }
    setValidation(null);
    busy.current = true;
    try {

      const job = await create.mutateAsync(input.data);
      dirty.current = false;
      void presentation.showToast({ title: copy.acceptedTitle, intent: 'success' });
      onCreated(job);

    } catch {
      /* Keep the same request key and form draft for an uncertain response. */
    } finally { busy.current = false; }

  }

  function renderForm() {

    return (
      <form noValidate id="create-background-job" onSubmit={submit} className="grid gap-5">
        <Field labelText={copy.nameLabel}>
          <Input
            ref={inputRef}
            value={name}
            maxLength={80}
            placeholder={copy.namePlaceholder}
            disabled={create.isPending}
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? 'job-create-validation' : undefined}
            onChange={(event) => {

              dirty.current = true;
              setName(event.target.value);
              setValidation(null);

            }}
          />
        </Field>
        <Field labelText={copy.typeLabel}>
          <Select value={type} disabled={create.isPending} onValueChange={(value) => {

            dirty.current = true;
            setType(value);

          }}>
            <option value={sampleJobTypes.report}>{copy.reportLabel}</option>
            <option value={sampleJobTypes.export}>{copy.exportLabel}</option>
          </Select>
        </Field>
        <Checkbox
          label={copy.failureLabel}
          description={copy.failureHint}
          checked={failFirstAttempt}
          disabled={create.isPending}
          onChange={(event) => {

            dirty.current = true;
            setFailFirstAttempt(event.target.checked);

          }}
        />
        {validation && <p id="job-create-validation" role="alert" className="m-0 text-sm text-error-primary">{validation}</p>}
        <MutationError error={create.error} />
      </form>
    );

  }

  return (
    <Modal
      open
      title={copy.createTitle}
      description={copy.createDescription}
      initialFocusRef={inputRef}
      onDismiss={() => void dismiss()}
      footer={(
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" disabled={create.isPending} onClick={() => void dismiss()}>{copy.dismissAction}</Button>
          <Button type="submit" form="create-background-job" loading={create.isPending} disabled={create.isPending}>{copy.queueAction}</Button>
        </div>
      )}
    >
      {renderForm()}
    </Modal>
  );

}
