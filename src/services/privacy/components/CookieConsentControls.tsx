'use client';
import { useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { strings } from '@/strings';

import {
  getConsent,
  saveConsent,
  subscribeConsent,
} from '../cookieConsentStore';
import type { CookieConsentControlsProps } from '../models/cookieConsentControlsProps';

export function CookieConsentControls({
  settings = false,
}: CookieConsentControlsProps) {

  const config = useRuntimeConfig();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => null,
  );
  const [message, setMessage] = useState('');
  if (config.demoMode || !config.amplitudeApiKey) {

    return settings ? (
      <p className="text-sm text-secondary">
        {config.demoMode ? strings.privacy.demoHint : strings.privacy.description}
      </p>
    ) : null;

  }
  if (!settings && consent) { return null; }

  function renderConsentActions() {

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {

            saveConsent('declined');
            setMessage(strings.privacy.savedHint);

          }}
          aria-pressed={consent === 'declined'}
        >
          {strings.privacy.decline}
        </Button>
        <Button
          onClick={() => {

            saveConsent('accepted');
            setMessage(strings.privacy.savedHint);

          }}
          aria-pressed={consent === 'accepted'}
        >
          {strings.privacy.accept}
        </Button>
      </div>
    );

  }

  return (
    <section
      aria-label={strings.privacy.title}
      className={
        settings
          ? 'grid gap-3'
          : 'fixed bottom-4 left-4 right-4 z-50 mx-auto grid max-w-xl gap-3 rounded-xl border-control border-secondary bg-primary p-5 shadow-lg'
      }
    >
      <h2 className="font-semibold text-primary">{strings.privacy.title}</h2>
      <p className="text-sm text-secondary">{strings.privacy.description}</p>
      {renderConsentActions()}
      <p role="status" className="text-sm text-secondary">
        {message}
      </p>
    </section>
  );

}
