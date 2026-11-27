import 'server-only';
import { portalModules } from '@/config/portalModules';
import type { RuntimeConfig } from '@/models/runtimeConfig';
import { isPublicHttpsUrl } from '@/services/media/models/publicImageUrl';
import { strings } from '@/strings';

const amplitudeEndpoints = new Map([
  ['US', 'https://api2.amplitude.com/2/httpapi'],
  ['EU', 'https://api.eu.amplitude.com/2/httpapi'],
]);

function required(name: string): string {

  const value = process.env[name]?.trim();
  if (!value) { throw new Error(strings.environment.missing(name)); }
  return value;

}

export const environment = {
  get privacyNoticeUrl() {

    const url = process.env.PORTAL_PRIVACY_NOTICE_URL?.trim();
    return url && isPublicHttpsUrl(url) ? url : null;

  },
  get demoMode() {
    return process.env.DEMO_MODE === 'true';
  },
  get sessionSecret() {

    const value = process.env.SESSION_SECRET;
    if (this.demoMode) { return value || 'portal-demo-only-local-session-secret'; }
    if (!value || value.length < 32 || value.includes('replace-with')) { throw new Error(strings.environment.secret); }
    return value;

  },
  get apiUrl() {

    const url = new URL(required('PORTAL_API_URL'));
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) { throw new Error(strings.environment.invalid); }
    return url.toString().replace(/\/$/, '');

  },
  get firebaseApiKey() {
    return required('FIREBASE_WEB_API_KEY');
  },
  get appVersion() {
    return process.env.APP_VERSION || '1.0.0';
  },
};

export function getRuntimeConfig(
  demoMode = environment.demoMode,
): RuntimeConfig {

  if (demoMode) {

    return {
      demoMode: true,
      onboardingEnabled: portalModules.onboarding,
      socketUrl: null,
      messaging: null,
      amplitudeApiKey: null,
      amplitudeEndpoint: null,
    };

  }
  const firebase = {
    apiKey: process.env.FIREBASE_WEB_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  };
  const vapidKey = process.env.FIREBASE_VAPID_PUBLIC_KEY || '';
  const amplitudeZone = process.env.AMPLITUDE_SERVER_ZONE?.trim().toUpperCase() || 'US';
  const amplitudeEndpoint = amplitudeEndpoints.get(amplitudeZone) ?? null;
  const runtimeConfig = {
    demoMode: false,
    onboardingEnabled:
      portalModules.onboarding &&
      process.env.PORTAL_ONBOARDING_ENABLED === 'true',
    socketUrl: process.env.PORTAL_SOCKET_URL || null,
    messaging:
      Object.values(firebase).every(Boolean) && vapidKey
        ? { firebase, vapidKey }
        : null,
    amplitudeApiKey: amplitudeEndpoint ? process.env.AMPLITUDE_API_KEY?.trim() || null : null,
    amplitudeEndpoint,
  };

  return runtimeConfig;

}

export function getSessionSecret(demoMode = environment.demoMode) {

  const value = process.env.SESSION_SECRET;
  if (demoMode) { return value || 'portal-demo-only-local-session-secret'; }
  if (!value || value.length < 32 || value.includes('replace-with')) { throw new Error(strings.environment.secret); }
  return value;

}
