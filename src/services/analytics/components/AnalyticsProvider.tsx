'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import {
  getConsent,
  subscribeConsent,
} from '@/services/privacy/cookieConsentStore';
import { analyticsService } from '../analyticsService';
export function AnalyticsProvider() {
  const config = useRuntimeConfig();
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => null,
  );
  useEffect(() => {
    let cancelled = false;
    const screen = pathname.replace(/\/[0-9a-f-]{36}(?=\/|$)/gi, '/:id');
    void analyticsService
      .configure(
        config.demoMode ? null : config.amplitudeApiKey,
        consent === 'accepted',
      )
      .then(() => {
        if (!cancelled) analyticsService.trackScreen(screen);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [config.amplitudeApiKey, config.demoMode, consent, pathname]);
  return null;
}
