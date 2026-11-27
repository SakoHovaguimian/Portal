'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { flattenError } from 'zod';

import {
  Button,
  Field,
  Input,
  Message,
  PasswordInput,
  UiIcon,
} from '@/components/ui';
import { SignupInputSchema, type SignupInput } from '@/models/signupInput';
import { useProjectRouting, useRuntimeConfig } from '@/providers/RuntimeProvider';
import { strings, portalDemoStrings } from '@/strings';

import { AuthCardShell } from './AuthCardShell';
import type { AuthRedirectProps } from './models/authRedirectProps';
import { createSession, resolveSessionRedirect } from './sessionClient';
import { useAuthFormErrors } from './useAuthFormErrors';

export function SignupScreen({ redirectTo }: AuthRedirectProps) {

  const router = useRouter();
  const routing = useProjectRouting();
  const { demoMode } = useRuntimeConfig();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    formRef,
    errors,
    formError,
    setFormError,
    showFieldErrors,
    clearFieldError,
    clearFieldErrors,
  } = useAuthFormErrors<keyof SignupInput>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (pending) { return; }
    setFormError(null);
    const input = SignupInputSchema.safeParse({ firstName, lastName, email, password });
    if (!input.success) {

      showFieldErrors(flattenError(input.error).fieldErrors);
      return;

    }
    clearFieldErrors();
    setPending(true);

    try {

      const result = await createSession({ action: 'signup', ...input.data });

      router.push(
        resolveSessionRedirect(routing, redirectTo, result.onboardingRequired, result.user.role),
      );
      router.refresh();

    } catch (caughtError) {

      setFormError(
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
        <Field labelText={strings.ui.signupScreen.firstName} error={errors.firstName?.[0]}>
          <Input
            name="firstName"
            required
            autoComplete="given-name"
            placeholder={strings.ui.signupScreen.sako}
            value={firstName}
            disabled={pending}
            onChange={(event) => {

              setFirstName(event.target.value);
              clearFieldError('firstName');

            }}
          />
        </Field>
        <Field labelText={strings.ui.signupScreen.lastName} error={errors.lastName?.[0]}>
          <Input
            name="lastName"
            required
            autoComplete="family-name"
            placeholder={strings.ui.signupScreen.hovaguimian}
            value={lastName}
            disabled={pending}
            onChange={(event) => {

              setLastName(event.target.value);
              clearFieldError('lastName');

            }}
          />
        </Field>
      </div>
    );

  }

  function renderSignupError() {

    if (!formError) {
      return null;
    }
    return (
      <Message
        intent="danger"
        title={formError}
      />
    );

  }

  function renderSignupForm() {

    return (
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="grid gap-(--space-field)">
        {renderNameFields()}
        <Field labelText={strings.ui.signupScreen.email} error={errors.email?.[0]}>
          <Input
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder={strings.ui.signupScreen.youCompanyComData}
            leadingIcon={<UiIcon name="mail" className="size-5" />}
            value={email}
            disabled={pending}
            onChange={(event) => {

              setEmail(event.target.value);
              clearFieldError('email');

            }}
          />
        </Field>
        <div className="grid gap-2">
          <Field labelText={strings.ui.signupScreen.password} error={errors.password?.[0]}>
            <PasswordInput
              name="password"
              required
              autoComplete="new-password"
              leadingIcon={<UiIcon name="lock" className="size-5" />}
              value={password}
              aria-describedby={errors.password ? undefined : 'SignupScreen-password-hint'}
              disabled={pending}
              onChange={(event) => {

                setPassword(event.target.value);
                clearFieldError('password');

              }}
            />
          </Field>
          {!errors.password && (
            <p id="SignupScreen-password-hint" className="m-0 text-xs text-secondary">
              {strings.auth.passwordHint}
            </p>
          )}
        </div>
        {renderSignupError()}
        <Button
          type="submit"
          disabled={pending}
          loading={pending}
          className="mt-1 min-h-(--control-height-lg) w-full"
        >
          {strings.ui.signupScreen.createAccount}
          <UiIcon name="arrowRight" className="size-4" />
        </Button>
        <span role="status" className="sr-only">
          {pending ? strings.ui.signupScreen.creatingAccount : ''}
        </span>
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
