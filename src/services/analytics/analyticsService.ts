'use client';
import type { Types } from '@amplitude/analytics-browser';

import { getConsent } from '@/services/privacy/cookieConsentStore';

class AnalyticsService {

  private client: Types.BrowserClient | null = null;
  private initializing: Promise<void> | null = null;
  private enabled = false;

  // **************************************
  // MARK: - CONFIGURE ANALYTICS
  // **************************************

  async configure(apiKey: string | null, accepted: boolean) {

    this.enabled = Boolean(apiKey && accepted);
    if (!this.enabled) {

      this.client?.setOptOut(true);
      this.client?.reset();
      this.clearStorage();
      return;

    }
    if (!this.initializing && !this.client) {

      this.initializing = this.initialize(apiKey!).finally(() => {
        this.initializing = null;
      });

    }
    await this.initializing;
    this.client?.setOptOut(!this.enabled || getConsent() !== 'accepted');

  }

  // **************************************
  // MARK: - INITIALIZE ANALYTICS
  // **************************************

  private async initialize(apiKey: string) {

    const amplitude = await import('@amplitude/analytics-browser');
    if (!this.enabled || getConsent() !== 'accepted') { return; }
    const client = amplitude.createInstance();
    this.client = client;
    await client.init(apiKey, undefined, {
      autocapture: false,
      defaultTracking: false,
      identityStorage: 'localStorage',
    }).promise;
    if (!this.enabled || getConsent() !== 'accepted') {

      client.setOptOut(true);
      client.reset();
      this.clearStorage();

    }

  }

  // **************************************
  // MARK: - TRACK SCREEN
  // **************************************

  trackScreen(route: string) {

    if (this.enabled && getConsent() === 'accepted') { this.client?.track('screen_view', { screen: route }); }

  }

  // **************************************
  // MARK: - CLEAR ANALYTICS STORAGE
  // **************************************

  private clearStorage() {

    try {

      for (const storage of [localStorage, sessionStorage]) {

        for (const key of Object.keys(storage)) {

          if (/^(AMP_|amplitude_)/i.test(key)) { storage.removeItem(key); }

        }

      }

    } catch {
      /* Storage may be unavailable; the SDK is still opted out. */
    }

  }

}

export const analyticsService = new AnalyticsService();
