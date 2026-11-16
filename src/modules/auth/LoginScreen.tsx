'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Field,
  Input,
  Message,
  PasswordInput,
  Select,
  UiIcon,
} from '@/components/ui';
import { useProjectRouting, useRuntimeConfig } from '@/providers/RuntimeProvider';
import {
  DemoPresetSchema,
  type DemoPreset,
} from '@/services/demo/models/demoPreset';
import { strings, portalDemoStrings as demoCopy } from '@/strings';

import { AuthCardShell } from './AuthCardShell';
import type { AuthRedirectProps } from './models/authRedirectProps';
import { createSession, resolveSessionRedirect } from './sessionClient';

export function LoginScreen({ redirectTo }: AuthRedirectProps) {

  const router = useRouter();
  const routing = useProjectRouting();
  const { demoMode, devSettingsEnabled } = useRuntimeConfig();
  const [preset, setPreset] = useState<DemoPreset>('populated');
  const [email, setEmail] = useState(
    demoMode ? strings.ui.loginScreen.sakoExampleComData : '',
  );
  const [password, setPassword] = useState(
    demoMode ? strings.ui.loginScreen.password123Data : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'signIn' | 'demo' | null>(null);
  const pending = pendingAction !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const form = event.currentTarget;
    if (pending) { return; }
    setPendingAction('signIn');
    setError(null);
    setDemoError(null);

    try {

      const result = await createSession({ action: 'login', email, password });

      router.push(
        resolveSessionRedirect(routing, redirectTo, result.onboardingRequired, result.user.role),
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
      setPendingAction(null);
    }

  }

  async function openPreset() {

    if (pending) { return; }
    setPendingAction('demo');
    setError(null);
    setDemoError(null);
    try {

      const result = await createSession({ action: 'preset', preset });
      router.push(
        resolveSessionRedirect(routing, redirectTo, result.onboardingRequired, result.user.role),
      );
      router.refresh();

    } catch (error) {

      setDemoError(
        error instanceof Error
          ? error.message
          : strings.ui.loginScreen.loginFailed,
      );

    } finally {
      setPendingAction(null);
    }

  }

  async function enableDemo() {

    if (pending) { return; }
    setPendingAction('demo');
    setError(null);
    setDemoError(null);
    try {

      const response = await fetch('/api/dev-settings/demo', {
        method: 'POST',
      });
      if (!response.ok) { throw new Error(demoCopy.errorDescription); }
      window.location.reload();

    } catch (error) {

      setDemoError(
        error instanceof Error ? error.message : demoCopy.errorDescription,
      );
      setPendingAction(null);

    }

  }

  function renderDemoAccountOption(
    [key, account]: [
      string,
      (typeof demoCopy.accountsData)[keyof typeof demoCopy.accountsData],
    ],
  ) {

    return (
      <option key={key} value={key}>
        {account.label}
      </option>
    );

  }

  function renderDemoPresetSection() {

    const accountOptions = Object.entries(demoCopy.accountsData).map(
      renderDemoAccountOption,
    );

    return (
      <section
        className="grid gap-3 rounded-card border-control border-secondary bg-secondary_subtle p-4"
        aria-labelledby="auth-demo-title"
      >
        <h2 id="auth-demo-title" className="m-0 text-sm font-semibold text-primary">
          {demoCopy.presetsTitle}
        </h2>
        <p className="m-0 text-xs text-secondary">{demoCopy.presetsDescription}</p>
        <Field labelText={demoCopy.selectAccount}>
          <Select
            className="min-h-(--control-height-md)"
            value={preset}
            disabled={pending}
            onValueChange={(value) =>
              setPreset(DemoPresetSchema.parse(value))
            }
          >
            {accountOptions}
          </Select>
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <p className="m-0 flex-1 basis-40 text-sm text-secondary">
            {demoCopy.accountsData[preset].description}
          </p>
          <Button
            variant="secondary"
            disabled={pending}
            loading={pendingAction === 'demo'}
            onClick={() => void openPreset()}
          >
            {demoCopy.signInPreset}
          </Button>
        </div>
        {demoError && <Message intent="danger" title={demoError} />}
      </section>
    );

  }

  function renderEnableDemoButton() {

    return (
      <div className="grid justify-items-start gap-3">
        <Button
          variant="secondary"
          disabled={pending}
          loading={pendingAction === 'demo'}
          onClick={() => void enableDemo()}
        >
          {demoCopy.demoModeLabel}
        </Button>
        {demoError && <Message intent="danger" title={demoError} />}
      </div>
    );

  }

  function renderLoginError() {

    if (!error) {
      return null;
    }
    return (
      <Message
        id="LoginScreen-error"
        intent="danger"
        title={error}
      />
    );

  }

  function renderLoginForm() {

    return (
      <form noValidate onSubmit={handleSubmit} className="grid gap-(--space-field)">
        <Field labelText={strings.ui.loginScreen.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder={strings.ui.loginScreen.youCompanyComData}
            leadingIcon={<UiIcon name="mail" className="size-5" />}
            value={email}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'LoginScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.loginScreen.password}>
          <PasswordInput
            autoComplete="current-password"
            placeholder={strings.ui.loginScreen.enterYourPasswordHint}
            leadingIcon={<UiIcon name="lock" className="size-5" />}
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'LoginScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {renderLoginError()}
        <Button
          type="submit"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'LoginScreen-error' : undefined}
          disabled={pending}
          loading={pendingAction === 'signIn'}
          className="mt-1 min-h-(--control-height-lg) w-full"
        >
          {strings.ui.loginScreen.signIn}
          <UiIcon name="arrowRight" className="size-4" />
        </Button>
      </form>
    );

  }

  return (
    <AuthCardShell
      title={strings.ui.loginScreen.welcomeBack}
      description={strings.ui.loginScreen.signInToWorkspaceHint}
      footerPrompt={strings.ui.loginScreen.needAnAccount}
      footerHref={
        redirectTo
          ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
          : '/signup'
      }
      footerAction={strings.ui.loginScreen.createAccount}
      supportingContent={
        demoMode
          ? renderDemoPresetSection()
          : devSettingsEnabled && renderEnableDemoButton()
      }
    >
      {renderLoginForm()}
    </AuthCardShell>
  );

}
