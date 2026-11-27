'use client';
import { getConsent } from '@/services/privacy/cookieConsentStore';

import { getAnalyticsScreen } from './analyticsScreen';

class AnalyticsService {

  private deviceId?: string;
  private requests?: AbortController;

  // **************************************
  // MARK: - TRACK SCREEN
  // **************************************

  async trackScreen(apiKey: string, endpoint: string, pathname: string) {

    const screen = getAnalyticsScreen(pathname);
    if (!screen || getConsent() !== 'accepted' || !globalThis.crypto?.randomUUID) { return; }

    this.deviceId ??= crypto.randomUUID();
    this.requests ??= new AbortController();
    try {

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        redirect: 'error',
        cache: 'no-store',
        signal: this.requests.signal,
        body: JSON.stringify({
          api_key: apiKey,
          events: [{
            event_type: 'screen_view',
            event_properties: { screen },
            device_id: this.deviceId,
            insert_id: crypto.randomUUID(),
          }],
        }),
      });

    } catch {
      // Screen counts are best effort. Offline, aborted, and failed requests expire here.
    }

  }

  // **************************************
  // MARK: - WITHDRAW ANALYTICS
  // **************************************

  stop() {

    this.requests?.abort();
    this.requests = undefined;
    this.deviceId = undefined;

  }

  // **************************************
  // MARK: - REMOVE LEGACY SDK STORAGE
  // **************************************

  removeLegacyStorage(apiKey: string) {

    const prefix = apiKey.slice(0, 10);
    try {

      localStorage.removeItem(`AMP_${prefix}`);
      localStorage.removeItem(`AMP_unsent_${prefix}`);
      localStorage.removeItem(`AMP_remote_config_${prefix}`);

    } catch {
      // Storage may be unavailable.
    }
    try {
      window.indexedDB?.deleteDatabase(`AMP_diagnostics_${prefix}`);
    } catch {
      // IndexedDB access may be blocked independently of local storage.
    }

  }

}

export const analyticsService = new AnalyticsService();
