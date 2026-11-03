'use client';

import { strings, portalDemoStrings as demoCopy } from '@/strings';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, PasswordInput, Select } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { AuthCardShell } from './AuthCardShell';
import { LockIcon, MailIcon } from './authIcons';
import { createSession, resolveSessionRedirect } from './sessionClient';
import {
  DemoPresetSchema,
  type DemoPreset,
} from '@/services/demo/models/demoPreset';

export function LoginScreen({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { demoMode, devSettingsEnabled } = useRuntimeConfig();
  const [preset, setPreset] = useState<DemoPreset>('populated');
  const [email, setEmail] = useState(
    demoMode ? strings.ui.loginScreen.sakoExampleCom : '',
  );
  const [password, setPassword] = useState(
    demoMode ? strings.ui.loginScreen.password123 : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      const result = await createSession({ action: 'login', email, password });

      router.push(
        resolveSessionRedirect(redirectTo, result.onboardingRequired),
      );
      router.refresh();
    } catch (caughtError) {
      form.querySelector('input')?.focus();
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : strings.ui.loginScreen.loginFailed,
      );
    } finally {
      setPending(false);
    }
  }

  async function openPreset() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await createSession({ action: 'preset', preset });
      router.push(
        resolveSessionRedirect(redirectTo, result.onboardingRequired),
      );
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : strings.ui.loginScreen.loginFailed,
      );
    } finally {
      setPending(false);
    }
  }
  async function enableDemo() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/dev-settings/demo', {
        method: 'POST',
      });
      if (!response.ok) throw new Error(demoCopy.errorDescription);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : demoCopy.errorDescription,
      );
      setPending(false);
    }
  }
  return (
    <AuthCardShell
      badge={strings.ui.loginScreen.access}
      title={strings.ui.loginScreen.welcomeBack}
      description={strings.ui.loginScreen.signInToKeepUpWithYourPeopleRequests}
      footerPrompt={strings.ui.loginScreen.needAnAccount}
      footerHref={
        redirectTo
          ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
          : '/signup'
      }
      footerAction={strings.ui.loginScreen.createAccount}
      mockHint={
        demoMode
          ? strings.ui.loginScreen.demoModeIsEnabledSignInWithSakoExample
          : undefined
      }
    >
      {demoMode && (
        <div className="grid gap-3 border-b border-secondary pb-5">
          <h2 className="m-0 text-base font-semibold text-primary">
            {demoCopy.presetsTitle}
          </h2>
          <p className="m-0 text-sm text-secondary">
            {demoCopy.presetsDescription}
          </p>
          <Field labelText={demoCopy.selectAccount}>
            <Select
              value={preset}
              disabled={pending}
              onValueChange={(value) =>
                setPreset(DemoPresetSchema.parse(value))
              }
            >
              {Object.entries(demoCopy.accounts).map(([key, account]) => (
                <option key={key} value={key}>
                  {account.label}
                </option>
              ))}
            </Select>
          </Field>
          <p className="m-0 text-sm text-tertiary">
            {demoCopy.accounts[preset].description}
          </p>
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => void openPreset()}
          >
            {demoCopy.signInPreset}
          </Button>
        </div>
      )}
      {!demoMode && devSettingsEnabled && (
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() => void enableDemo()}
        >
          {demoCopy.demoModeLabel}
        </Button>
      )}
      <form noValidate onSubmit={handleSubmit} className="grid gap-4">
        <Field labelText={strings.ui.loginScreen.email}>
          <Input
            className="auth-panel-hover"
            type="email"
            autoComplete="email"
            placeholder={strings.ui.loginScreen.youCompanyCom}
            leadingIcon={<MailIcon className="h-5 w-5" />}
            value={email}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'LoginScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.loginScreen.password}>
          <PasswordInput
            className="auth-panel-hover"
            autoComplete="current-password"
            placeholder={strings.ui.loginScreen.enterYourPassword}
            leadingIcon={<LockIcon className="h-5 w-5" />}
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'LoginScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error ? (
          <p
            id="LoginScreen-error"
            role="alert"
            className="auth-reveal rounded-2xl border-control border-error-secondary bg-error-secondary/10 px-4 py-3 text-sm text-error-primary"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'LoginScreen-error' : undefined}
          disabled={pending}
          loading={pending}
          className="auth-panel-hover w-full"
        >
          {strings.ui.loginScreen.signIn}
        </Button>
      </form>
    </AuthCardShell>
  );
}
