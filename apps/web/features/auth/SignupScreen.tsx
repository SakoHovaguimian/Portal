'use client';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input } from '@semantic-web/ui';
import { appEnv } from '../../lib/auth/env';
import { getFirebaseAuth } from '../../lib/auth/firebase';
import { AuthCardShell } from './AuthCardShell';
import { LockIcon, MailIcon, UserIcon } from './authIcons';
import { createSession, resolveAuthRedirect } from './sessionClient';

export function SignupScreen({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      if (appEnv.enableMockAuth) {
        await createSession({
          mode: 'mock-signup',
          firstName,
          lastName,
          email,
          password,
        });
      } else {
        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase is not configured');
        }

        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: `${firstName} ${lastName}`.trim(),
        });
        const idToken = await credential.user.getIdToken();

        await createSession({
          mode: 'firebase',
          idToken,
          profile: {
            email,
            firstName,
            lastName,
          },
        });
      }

      router.push(resolveAuthRedirect(redirectTo));
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create account');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCardShell
      badge="Onboarding"
      title="Create your workspace account"
      description="Start with a lightweight operator account and land directly inside the semantic dashboard shell with the same ownership-safe flows as the rest of the template."
      footerPrompt="Already have an account?"
      footerHref={redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login'}
      footerAction="Back to login"
      mockHint={
        appEnv.enableMockAuth
          ? 'Mock signup creates a new local user instantly and signs you into the protected app shell.'
          : undefined
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field labelText="First name">
            <Input
              className="auth-panel-hover"
              autoComplete="given-name"
              placeholder="Sako"
              leadingIcon={<UserIcon className="h-5 w-5" />}
              value={firstName}
              disabled={!isHydrated || pending}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field labelText="Last name">
            <Input
              className="auth-panel-hover"
              autoComplete="family-name"
              placeholder="Hovaguimian"
              leadingIcon={<UserIcon className="h-5 w-5" />}
              value={lastName}
              disabled={!isHydrated || pending}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>
        <Field labelText="Email">
          <Input
            className="auth-panel-hover"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            leadingIcon={<MailIcon className="h-5 w-5" />}
            value={email}
            disabled={!isHydrated || pending}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field labelText="Password">
          <Input
            className="auth-panel-hover"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            leadingIcon={<LockIcon className="h-5 w-5" />}
            value={password}
            disabled={!isHydrated || pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error ? (
          <p className="auth-reveal rounded-2xl border border-error-secondary bg-error-secondary/10 px-4 py-3 text-sm text-error-primary">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={!isHydrated || pending} className="auth-panel-hover w-full">
          {pending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthCardShell>
  );
}
