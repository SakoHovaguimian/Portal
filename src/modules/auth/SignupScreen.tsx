'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Field,
  Input,
  Message,
  PasswordInput,
  UiIcon,
} from '@/components/ui';
import { useProjectRouting, useRuntimeConfig } from '@/providers/RuntimeProvider';
import { strings, portalDemoStrings } from '@/strings';

import { AuthCardShell } from './AuthCardShell';
import type { AuthRedirectProps } from './models/authRedirectProps';
import { createSession, resolveSessionRedirect } from './sessionClient';

export function SignupScreen({ redirectTo }: AuthRedirectProps) {

  const router = useRouter();
  const routing = useProjectRouting();
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
    if (pending) { return; }
    setPending(true);
    setError(null);

    try {

      const result = await createSession({
        action: 'signup',
        firstName,
        lastName,
        email,
        password,
      });

      router.push(
        resolveSessionRedirect(routing, redirectTo, result.onboardingRequired, result.user.role),
      );
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

  function renderNameFields() {

    return (
      <div className="grid gap-(--space-field) sm:grid-cols-2">
        <Field labelText={strings.ui.signupScreen.firstName}>
          <Input
            autoComplete="given-name"
            placeholder={strings.ui.signupScreen.sako}
            value={firstName}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.signupScreen.lastName}>
          <Input
            autoComplete="family-name"
            placeholder={strings.ui.signupScreen.hovaguimian}
            value={lastName}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setLastName(event.target.value)}
          />
        </Field>
      </div>
    );

  }

  function renderSignupError() {

    if (!error) {
      return null;
    }
    return (
      <Message
        id="SignupScreen-error"
        intent="danger"
        title={error}
      />
    );

  }

  function renderSignupForm() {

    return (
      <form noValidate onSubmit={handleSubmit} className="grid gap-(--space-field)">
        {renderNameFields()}
        <Field labelText={strings.ui.signupScreen.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder={strings.ui.signupScreen.youCompanyComData}
            leadingIcon={<UiIcon name="mail" className="size-5" />}
            value={email}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field labelText={strings.ui.signupScreen.password}>
          <PasswordInput
            autoComplete="new-password"
            placeholder={strings.ui.signupScreen.atLeast8CharactersHint}
            leadingIcon={<UiIcon name="lock" className="size-5" />}
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'SignupScreen-error' : undefined}
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {renderSignupError()}
        <Button
          type="submit"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'SignupScreen-error' : undefined}
          disabled={pending}
          loading={pending}
          className="mt-1 min-h-(--control-height-lg) w-full"
        >
          {strings.ui.signupScreen.createAccount}
          <UiIcon name="arrowRight" className="size-4" />
        </Button>
      </form>
    );

  }

  return (
    <AuthCardShell
      title={strings.ui.signupScreen.createAccountTitle}
      description={strings.ui.signupScreen.createYourAccountToJoinTheWorkspaceHint}
      footerPrompt={strings.ui.signupScreen.alreadyHaveAnAccount}
      footerHref={
        redirectTo
          ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
          : '/login'
      }
      footerAction={strings.ui.loginScreen.signIn}
      supportingContent={demoMode && (
        <Message
          intent="neutral"
          role="note"
          title={portalDemoStrings.demoModeLabel}
          description={portalDemoStrings.signupHint}
        />
      )}
    >
      {renderSignupForm()}
    </AuthCardShell>
  );

}
