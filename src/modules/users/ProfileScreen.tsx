'use client';

import { strings } from '@/strings';
import { useRef, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Field,
  FormActions,
  Input,
  Page,
  PageHeader,
  QueryBoundary,
} from '@/components/ui';
import type { User } from '@/models';
import { useSessionState } from '@/providers/AppProviders';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { usePresentationService } from '@/presentation/PresentationProvider';
import {
  ProfileDraftSchema,
  type ProfileDraft,
  type ProfileDraftErrors,
} from './models/profileDraft';
import type { ProfileFormProps } from './models/profileFormProps';
import { useUpdateCurrentUser, useUser } from './hooks';

function profileDraftFromUser(user: User): ProfileDraft {

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber ?? '',
    dateOfBirth: user.dateOfBirth?.slice(0, 10) ?? '',
  };

}

function equalDraft(a: ProfileDraft, b: ProfileDraft) {

  return (
    a.firstName === b.firstName &&
    a.lastName === b.lastName &&
    a.phoneNumber === b.phoneNumber &&
    a.dateOfBirth === b.dateOfBirth
  );

}

export function ProfileScreen() {

  const { session } = useSessionState();
  const query = useUser(session?.user.id ?? '');

  function renderContent() {

    return (
      <Page>
        <PageHeader title={strings.ui.profileScreen.yourProfile} />
        <QueryBoundary query={query} retainDataOnError>
          {(user) => <ProfileForm key={user.id} user={user} />}
        </QueryBoundary>
      </Page>
    );

  }

  return renderContent();

}

function ProfileForm({ user }: ProfileFormProps) {

  const presentation = usePresentationService();
  const mutation = useUpdateCurrentUser(user.id);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [errors, setErrors] = useState<ProfileDraftErrors>({});
  const baseline = useRef<ProfileDraft | null>(null);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  useUnsavedFormGuard(dirtyRef, busyRef);
  const current = draft ?? profileDraftFromUser(user);
  const error =
    Object.values(errors).find(Boolean) ??
    (mutation.isError ? mutation.error.message : undefined);

  function change<K extends keyof ProfileDraft>(
    key: K,
    value: ProfileDraft[K],
  ) {

    if (busyRef.current) {
      return;
    }
    if (draft === null) {
      baseline.current = profileDraftFromUser(user);
    }
    const next = { ...current, [key]: value };
    dirtyRef.current = !equalDraft(
      next,
      baseline.current ?? profileDraftFromUser(user),
    );
    setDraft(dirtyRef.current ? next : null);
    setErrors((previous) => ({ ...previous, [key]: undefined }));

  }

  function submit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (busyRef.current) {
      return;
    }
    const parsed = ProfileDraftSchema.safeParse(current);
    if (!parsed.success) {

      const next: ProfileDraftErrors = {};
      for (const issue of parsed.error.issues) {

        const key = issue.path[0] as keyof ProfileDraft;
        if (!next[key]) {
          next[key] = issue.message;
        }

      }
      setErrors(next);
      const key = String(parsed.error.issues[0]?.path[0]);
      formRef.current
        ?.querySelector<HTMLElement>(
          key === 'dateOfBirth'
            ? '[data-field-name="dateOfBirth"] [role="spinbutton"]'
            : `input[name="${key}"]`,
        )
        ?.focus();
      return;

    }
    setErrors({});
    busyRef.current = true;
    mutation.mutate(
      {
        ...parsed.data,
        email: user.email,
        phoneNumber: parsed.data.phoneNumber || null,
        dateOfBirth: parsed.data.dateOfBirth
          ? `${parsed.data.dateOfBirth}T00:00:00.000Z`
          : null,
      },
      {
        onSuccess: () => {

          dirtyRef.current = false;
          busyRef.current = false;
          baseline.current = null;
          setDraft(null);
          setErrors({});
          void presentation.showToast({
            title: strings.ui.profileScreen.profileUpdated,
            intent: 'success',
          });

        },
        onSettled: () => {
          busyRef.current = false;
        },
      },
    );

  }

  function renderNameFields() {

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field labelText={strings.ui.profileScreen.firstName}>
          <Input
            name="firstName"
            value={current.firstName}
            maxLength={80}
            autoComplete="given-name"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={
              errors.firstName ? 'profile-edit-error' : undefined
            }
            onChange={(event) => change('firstName', event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.profileScreen.lastName}>
          <Input
            name="lastName"
            value={current.lastName}
            maxLength={80}
            autoComplete="family-name"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={
              errors.lastName ? 'profile-edit-error' : undefined
            }
            onChange={(event) => change('lastName', event.target.value)}
          />
        </Field>
      </div>
    );

  }

  function renderContactFields() {

    return (
      <>
        <Field labelText={strings.ui.profileScreen.phoneNumber}>
          <Input
            name="phoneNumber"
            type="tel"
            value={current.phoneNumber}
            autoComplete="tel"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={
              errors.phoneNumber ? 'profile-edit-error' : undefined
            }
            onChange={(event) => change('phoneNumber', event.target.value)}
          />
        </Field>
        <DatePicker
          label={strings.ui.profileScreen.dateOfBirth}
          name="dateOfBirth"
          value={current.dateOfBirth}
          disabled={mutation.isPending}
          invalid={Boolean(errors.dateOfBirth)}
          describedBy={errors.dateOfBirth ? 'profile-edit-error' : undefined}
          onValueChange={(value) => change('dateOfBirth', value)}
        />
      </>
    );

  }

  function renderFeedback() {

    return error ? (
      <p
        id="profile-edit-error"
        role="alert"
        className="text-sm text-error-primary"
      >
        {error}
      </p>
    ) : null;

  }

  function renderActions() {

    return (
      <FormActions variant="plain">
        <Button
          loading={mutation.isPending}
          type="submit"
          disabled={mutation.isPending || draft === null}
        >
          {strings.ui.profileScreen.saveProfile}
        </Button>
      </FormActions>
    );

  }

  function renderForm() {

    return (
      <Card className="grid gap-5">
        <form ref={formRef} noValidate className="grid gap-4" onSubmit={submit}>
          {renderNameFields()}
          <Field labelText={strings.ui.profileScreen.email}>
            <Input
              type="email"
              value={user.email}
              readOnly
              autoComplete="email"
            />
          </Field>
          {renderContactFields()}
          {renderFeedback()}
          {renderActions()}
        </form>
      </Card>
    );

  }

  return renderForm();

}
