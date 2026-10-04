'use client';

import { strings } from '@/strings';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, PasswordInput } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { AuthCardShell } from './AuthCardShell';
import { LockIcon, MailIcon, UserIcon } from './authIcons';
import { createSession, resolveAuthRedirect } from './sessionClient';

export function SignupScreen({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { demoMode } = useRuntimeConfig();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      await createSession({
        action: 'signup',
        firstName,
        lastName,
        email,
        password,
      });

      router.push(resolveAuthRedirect(redirectTo));
      router.refresh();
    } catch (caughtError) {
      form.querySelector('input')?.focus();
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : strings.ui.signupScreen.unableToCreateAccount,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCardShell
      badge={strings.ui.signupScreen.onboarding}
      title={strings.ui.signupScreen.createYourWorkspaceAccount}
      description={strings.ui.signupScreen.createYourAccountToJoinTheWorkspace}
      footerPrompt={strings.ui.signupScreen.alreadyHaveAnAccount}
      footerHref={
        redirectTo
          ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
          : '/login'
      }
      footerAction={strings.ui.signupScreen.backToLogin}
      mockHint={
        demoMode
          ? strings.ui.signupScreen.demoAccountsAndChangesLastUntilTheDemoServer
          : undefined
      }
    >
      <form noValidate onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field labelText={strings.ui.signupScreen.firstName}>
            <Input
              className="auth-panel-hover"
              autoComplete="given-name"
              placeholder={strings.ui.signupScreen.sako}
              leadingIcon={<UserIcon className="h-5 w-5" />}
              value={firstName}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'SignupScreen-error' : undefined}
              disabled={pending}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field labelText={strings.ui.signupScreen.lastName}>
            <Input
              className="auth-panel-hover"
              autoComplete="family-name"
              placeholder={strings.ui.signupScreen.hovaguimian}
              leadingIcon={<UserIcon className="h-5 w-5" />}
              value={lastName}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'SignupScreen-error' : undefined}
              disabled={pending}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>
        <Field labelText={strings.ui.signupScreen.email}>
          <Input
            className="auth-panel-hover"
            type="email"
            autoComplete="email"
            placeholder={strings.ui.signupScreen.youCompanyCom}
            leadingIcon={<MailIcon className="h-5 w-5" />}
            value={email}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.signupScreen.password}>
          <PasswordInput
            className="auth-panel-hover"
            autoComplete="new-password"
            placeholder={strings.ui.signupScreen.atLeast8Characters}
            leadingIcon={<LockIcon className="h-5 w-5" />}
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error ? (
          <p
            id="SignupScreen-error"
            role="alert"
            className="auth-reveal rounded-2xl border border-error-secondary bg-error-secondary/10 px-4 py-3 text-sm text-error-primary"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'SignupScreen-error' : undefined}
          disabled={pending}
          className="auth-panel-hover w-full"
        >
          {pending
            ? strings.ui.signupScreen.creatingAccount
            : strings.ui.signupScreen.createAccount}
        </Button>
      </form>
    </AuthCardShell>
  );
}
