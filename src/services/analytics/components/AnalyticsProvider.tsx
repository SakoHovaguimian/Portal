'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import {
  getConsent,
  subscribeConsent,
} from '@/services/privacy/cookieConsentStore';

import { analyticsService } from '../analyticsService';

function subscribeToAnalyticsConsent(notify: () => void) {

  const unsubscribe = subscribeConsent(() => {

    // A background tab may observe withdrawal after a later opt-in was saved.
    // End the previous identity on the notification itself.
    analyticsService.stop();
    notify();

  });

  return unsubscribe;

}

export function AnalyticsProvider() {

  const config = useRuntimeConfig();
  const pathname = usePathname();
  const apiKey = config.demoMode ? null : config.amplitudeApiKey;
  const endpoint = config.amplitudeEndpoint;
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, getConsent, () => null);

  useEffect(() => {

    if (apiKey) { analyticsService.removeLegacyStorage(apiKey); }
    const cleanup = () => analyticsService.stop();
    return cleanup;

  }, [apiKey, endpoint]);

  useEffect(() => {

    if (!apiKey || !endpoint || consent !== 'accepted') { return; }
    const timer = window.setTimeout(() => {
      void analyticsService.trackScreen(apiKey, endpoint, pathname);
    }, 0);
    const cleanup = () => window.clearTimeout(timer);
    return cleanup;

  }, [apiKey, consent, endpoint, pathname]);
  return null;

}
