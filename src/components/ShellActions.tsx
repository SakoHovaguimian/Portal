'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { useSessionState } from '@/providers/AppProviders';
import { useRealtime } from '@/services/realtime/RealtimeProvider';
import { strings } from '@/strings';
export function ShellActions() {
  const router = useRouter();
  const { setSession } = useSessionState();
  const realtime = useRealtime();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <div className="grid gap-2">
      <Button
        variant="secondary"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError('');
          try {
            // A push-service outage must not prevent clearing the session.
            await realtime.prepareForLogout().catch(() => undefined);
            const response = await fetch('/api/auth/logout', {
              method: 'POST',
            });
            if (!response.ok) throw new Error(strings.auth.logoutFailed);
            await queryClient.cancelQueries();
            queryClient.clear();
            setSession(null);
            router.replace('/login');
            router.refresh();
          } catch {
            setError(strings.auth.logoutFailed);
            setPending(false);
          }
        }}
      >
        {strings.ui.shellActions.logOut}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-error-primary">
          {error}
        </p>
      )}
    </div>
  );
}
