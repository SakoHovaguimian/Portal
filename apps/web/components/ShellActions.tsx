'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@semantic-web/ui';
import { useSessionState } from '@/providers/AppProviders';
import { usePresentationService } from '@/presentation/PresentationProvider';

export function ShellActions() {
  const router = useRouter();
  const { setSession } = useSessionState();
  const presentation = usePresentationService();

  return (
    <div className="grid gap-2">
      <Button
        variant="secondary"
        onClick={async () => {
          const confirmed = await presentation.showAlert({
            title: 'Log out of the operational shell?',
            description: 'This clears the signed session cookie and returns you to the auth surface.',
            tone: 'warning',
            alignment: 'center',
            confirmLabel: 'Log out',
            cancelLabel: 'Stay signed in',
          });

          if (!confirmed) {
            return;
          }

          await fetch('/api/auth/logout', { method: 'POST' });
          setSession(null);
          await presentation.showToast({
            title: 'Signed out',
            description: 'Session cleared and auth surface restored.',
            intent: 'info',
            position: 'top-right',
          });
          router.push('/login');
          router.refresh();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
