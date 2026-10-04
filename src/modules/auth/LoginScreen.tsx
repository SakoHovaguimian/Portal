'use client';

import { strings } from '@/strings';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, PasswordInput } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { AuthCardShell } from './AuthCardShell';
import { LockIcon, MailIcon } from './authIcons';
import { createSession, resolveAuthRedirect } from './sessionClient';

export function LoginScreen({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { demoMode } = useRuntimeConfig();
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
      await createSession({ action: 'login', email, password });

      router.push(resolveAuthRedirect(redirectTo));
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
            className="auth-reveal rounded-2xl border border-error-secondary bg-error-secondary/10 px-4 py-3 text-sm text-error-primary"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'LoginScreen-error' : undefined}
          disabled={pending}
          className="auth-panel-hover w-full"
        >
          {pending
            ? strings.ui.loginScreen.signingIn
            : strings.ui.loginScreen.signIn}
        </Button>
      </form>
    </AuthCardShell>
  );
}
