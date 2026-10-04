'use client';
import { useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui';
import { strings } from '@/strings';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import {
  getConsent,
  saveConsent,
  subscribeConsent,
} from '../cookieConsentStore';
export function CookieConsentControls({
  settings = false,
}: {
  settings?: boolean;
}) {
  const config = useRuntimeConfig();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => null,
  );
  const [message, setMessage] = useState('');
  if (config.demoMode || !config.amplitudeApiKey)
    return settings ? (
      <p className="text-sm text-secondary">
        {config.demoMode ? strings.privacy.demo : strings.privacy.description}
      </p>
    ) : null;
  if (!settings && consent) return null;
  return (
    <section
      aria-label={strings.privacy.title}
      className={
        settings
          ? 'grid gap-3'
          : 'fixed bottom-4 left-4 right-4 z-50 mx-auto grid max-w-xl gap-3 rounded-xl border border-secondary bg-primary p-5 shadow-lg'
      }
    >
      <h2 className="font-semibold text-primary">{strings.privacy.title}</h2>
      <p className="text-sm text-secondary">{strings.privacy.description}</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            saveConsent('declined');
            setMessage(strings.privacy.saved);
          }}
          aria-pressed={consent === 'declined'}
        >
          {strings.privacy.decline}
        </Button>
        <Button
          onClick={() => {
            saveConsent('accepted');
            setMessage(strings.privacy.saved);
          }}
          aria-pressed={consent === 'accepted'}
        >
          {strings.privacy.accept}
        </Button>
      </div>
      <p role="status" className="text-sm text-secondary">
        {message}
      </p>
    </section>
  );
}
