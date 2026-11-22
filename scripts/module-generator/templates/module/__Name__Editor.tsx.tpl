'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Card, Field, FormActions, Input, Page, PageHeader } from '@/components/ui';
import { DomainError } from '@/errors/domainErrors';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useGuardedNavigate } from '@/providers/useGuardedNavigate';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { portalActionStrings, portal__Name__Strings as copy, strings } from '@/strings';

import { useSave__Name__Record } from './hooks';
import type { __Name__EditorProps } from './models/__key__EditorProps';
import { __Name__InputSchema } from './models/__key__Record';

export function __Name__Editor({ record }: __Name__EditorProps) {

  const router = useRouter();
  const navigate = useGuardedNavigate();
  const presentation = usePresentationService();
  const save = useSave__Name__Record(record?.id);
  const [draft, setDraft] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const dirty = useRef(false);
  const busy = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  useUnsavedFormGuard(dirty, busy);
  const baseline = record?.name ?? '';
  const name = draft ?? baseline;
  const title = record?.name ?? copy.createAction;
  const error = invalid ? copy.nameHint : save.isError
    ? save.error instanceof DomainError && save.error.status < 500 ? save.error.message : strings.errors.requestFailed
    : null;

  function changeName(value: string) {

    dirty.current = value !== baseline;
    setDraft(dirty.current ? value : null);
    setInvalid(false);
    if (save.isError) { save.reset(); }

  }

  function submit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (busy.current) { return; }
    const parsed = __Name__InputSchema.safeParse({ name });
    if (!parsed.success) {

      setInvalid(true);
      input.current?.focus();
      return;

    }
    busy.current = true;
    save.mutate(parsed.data, {
      onSuccess: (saved) => {

        dirty.current = false;
        busy.current = false;
        setDraft(null);
        void presentation.showToast({ title: copy.savedTitle, intent: 'success' });
        if (!record) { router.replace(`/__slug__/${saved.id}`); }

      },
      onSettled: () => { busy.current = false; },
    });

  }

  function renderNameField() {

    return (
      <Field labelText={copy.nameLabel}>
        <Input
          ref={input}
          value={name}
          maxLength={120}
          required
          disabled={save.isPending}
          aria-invalid={invalid}
          aria-describedby={error ? '__slug__-error' : undefined}
          onChange={(event) => changeName(event.target.value)}
        />
      </Field>
    );

  }

  return (
    <Page>
      <PageHeader title={title} breadcrumbs={[{ label: copy.title, href: '/__slug__' }, { label: title }]} onNavigate={navigate} />
      <Card>
        <form noValidate onSubmit={submit} className="grid gap-4">
          {renderNameField()}
          {error && <p role="alert" id="__slug__-error" className="text-sm text-error-primary">{error}</p>}
          <FormActions variant="inline">
            <Button type="submit" loading={save.isPending} disabled={save.isPending || (Boolean(record) && draft === null)}>
              {record ? portalActionStrings.saveChanges : copy.createAction}
            </Button>
          </FormActions>
        </form>
      </Card>
    </Page>
  );

}
