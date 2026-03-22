'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input } from '@semantic-web/ui';
import { appEnv } from '../../lib/auth/env';
import { getFirebaseAuth } from '../../lib/auth/firebase';
import { AuthCardShell } from './AuthCardShell';
import { LockIcon, MailIcon } from './authIcons';
import { createSession, resolveAuthRedirect } from './sessionClient';

export function LoginScreen({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('sako@example.com');
  const [password, setPassword] = useState('password123');
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
        await createSession({ mode: 'mock', email, password });
      } else {
        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase is not configured');
        }

        const credential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken();
        await createSession({
          mode: 'firebase',
          idToken,
          profile: {
            email: credential.user.email,
            firstName: credential.user.displayName?.split(' ')[0] ?? 'Authenticated',
            lastName: credential.user.displayName?.split(' ').slice(1).join(' ') || 'User',
          },
        });
      }

      router.push(resolveAuthRedirect(redirectTo));
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCardShell
      badge="Access"
      title="Welcome back"
      description="Sign in to the operational workspace and pick up your users, feature requests, and dashboard context right where you left it."
      footerPrompt="Need an account?"
      footerHref={redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : '/signup'}
      footerAction="Create account"
      mockHint={
        appEnv.enableMockAuth
          ? 'Mock auth is enabled. Use sako@example.com with password123, or create a fresh mock account below.'
          : undefined
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
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
            autoComplete="current-password"
            placeholder="Enter your password"
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
          {pending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthCardShell>
  );
}
