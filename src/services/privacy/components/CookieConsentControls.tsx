'use client';
import { useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { strings } from '@/strings';

import {
  getConsentState,
  saveConsent,
  subscribeConsent,
} from '../cookieConsentStore';
import type { CookieConsentControlsProps } from '../models/cookieConsentControlsProps';

import { PrivacyNoticeLink } from './PrivacyNoticeLink';

export function CookieConsentControls({
  settings = false,
  noticePage = false,
}: CookieConsentControlsProps) {

  const config = useRuntimeConfig();
  const consent = useSyncExternalStore<ReturnType<typeof getConsentState> | undefined>(
    subscribeConsent,
    getConsentState,
    () => undefined,
  );
  const [engaged, setEngaged] = useState(false);
  const banner = !settings && !noticePage;
  const Container = banner ? 'section' : 'div';
  const trackingAvailable = !config.demoMode && Boolean(config.amplitudeApiKey);
  const hasChoice = consent === 'accepted' || consent === 'declined';
  if (banner && (!trackingAvailable || consent === undefined || (hasChoice && !engaged))) { return null; }

  function getStatus() {

    if (config.demoMode) { return strings.privacy.demoHint; }
    if (!trackingAvailable) { return strings.privacy.unavailableHint; }
    if (consent === undefined) { return null; }
    if (consent === 'storage-error') { return strings.privacy.saveFailedHint; }
    if (consent === 'accepted') { return strings.privacy.acceptedHint; }
    if (consent === 'declined') { return strings.privacy.declinedHint; }
    return strings.privacy.undecidedHint;

  }

  function renderConsentActions() {

    return (
      <div className="grid w-fit max-w-full gap-2 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() => saveConsent('declined')}
          aria-pressed={consent === 'declined'}
        >
          {strings.privacy.decline}
        </Button>
        <Button
          variant="secondary"
          onClick={() => saveConsent('accepted')}
          aria-pressed={consent === 'accepted'}
        >
          {strings.privacy.accept}
        </Button>
      </div>
    );

  }

  return (
    <Container
      aria-label={banner ? strings.privacy.title : undefined}
      onFocusCapture={banner ? () => setEngaged(true) : undefined}
      className={banner ? 'ui-safe-area-content border-t-control border-secondary bg-primary [--ui-content-gutter:var(--space-page)]' : undefined}
    >
      <div className={banner ? 'mx-auto grid max-w-3xl gap-3' : 'grid gap-3'}>
        {banner && <h2 className="font-semibold text-primary">{strings.privacy.title}</h2>}
        {trackingAvailable && <p className="text-sm text-secondary">{strings.privacy.description}</p>}
        {trackingAvailable && consent !== undefined && renderConsentActions()}
        <p role="status" className="text-sm text-secondary">{getStatus()}</p>
        {!noticePage && <PrivacyNoticeLink />}
      </div>
    </Container>
  );

}
