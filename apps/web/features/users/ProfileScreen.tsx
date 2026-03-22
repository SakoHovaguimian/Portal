'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input } from '@semantic-web/ui';
import type { User } from '@semantic-web/core';
import { useSessionState } from '../../providers/AppProviders';
import { usePresentationService } from '../../presentation/PresentationProvider';
import { useUpdateCurrentUser, useUser } from './hooks';

function toDateInputValue(value: string | null) {
  if (!value) {
    return '';
  }
  return value.slice(0, 10);
}

function toFormState(user: User) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber ?? '',
    dateOfBirth: toDateInputValue(user.dateOfBirth),
  };
}

export function ProfileScreen() {
  const router = useRouter();
  const { session } = useSessionState();
  const presentation = usePresentationService();
  const userId = session?.user.id ?? '';
  const { data } = useUser(userId);
  const updateMutation = useUpdateCurrentUser(userId);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
  });
  const [hasHydratedFromQuery, setHasHydratedFromQuery] = useState(false);

  useEffect(() => {
    if (!data || hasHydratedFromQuery) {
      return;
    }

    setFormState(toFormState(data));
    setHasHydratedFromQuery(true);
  }, [data, hasHydratedFromQuery]);

  const disabled = useMemo(
    () => !formState.firstName || !formState.lastName || !formState.email,
    [formState.email, formState.firstName, formState.lastName],
  );

  async function handleSaveProfile() {
    const updatedUser = await updateMutation.mutateAsync({
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      phoneNumber: formState.phoneNumber || null,
      dateOfBirth: formState.dateOfBirth ? new Date(formState.dateOfBirth).toISOString() : null,
    });
    setFormState(toFormState(updatedUser));
    await presentation.showToast({
      title: 'Profile updated',
      description: 'Canonical user record and active session details are now aligned.',
      intent: 'success',
      position: 'top-right',
    });
  }

  if (!session) {
    return null;
  }

  if (!hasHydratedFromQuery) {
    return (
      <Card>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem' }}>
            Profile
          </p>
          <h1 style={{ margin: 0 }}>Current user settings</h1>
          <p style={{ margin: 0 }}>Loading your canonical profile data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem' }}>
          Profile
        </p>
        <h1 style={{ margin: 0 }}>Current user settings</h1>
        <p style={{ margin: 0 }}>
          Update the canonical user record and keep the active session in sync for name and email changes.
        </p>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Field labelText="First name">
            <Input
              value={formState.firstName}
              onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))}
            />
          </Field>
          <Field labelText="Last name">
            <Input
              value={formState.lastName}
              onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))}
            />
          </Field>
        </div>
        <Field labelText="Email">
          <Input
            type="email"
            value={formState.email}
            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Field labelText="Phone number">
            <Input
              value={formState.phoneNumber}
              onChange={(event) => setFormState((current) => ({ ...current, phoneNumber: event.target.value }))}
            />
          </Field>
          <Field labelText="Date of birth">
            <Input
              type="date"
              value={formState.dateOfBirth}
              onChange={(event) => setFormState((current) => ({ ...current, dateOfBirth: event.target.value }))}
            />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button type="button" disabled={disabled || updateMutation.isPending} onClick={() => void handleSaveProfile()}>
            {updateMutation.isPending ? 'Saving profile...' : 'Save profile'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    </Card>
  );
}
