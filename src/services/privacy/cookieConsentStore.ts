'use client';
import type { CookieConsent } from './models/cookieConsent';
import { CookieConsentRecordSchema, cookieConsentVersion } from './models/cookieConsentRecord';

const key = 'portal-analytics-consent';
const event = 'portal:consent';
let storageWriteFailed = false;

// **************************************
// MARK: - READ COOKIE CONSENT STATE
// **************************************

export function getConsentState(): CookieConsent | 'storage-error' {

  if (storageWriteFailed) { return 'storage-error'; }
  try {

    const value = localStorage.getItem(key);
    if (!value) { return null; }
    const record = CookieConsentRecordSchema.safeParse(JSON.parse(value));
    return record.success ? record.data.choice : null;

  } catch {
    return null;
  }

}

// **************************************
// MARK: - GET COOKIE CONSENT
// **************************************

export function getConsent(): CookieConsent {

  const state = getConsentState();
  return state === 'storage-error' ? null : state;

}

// **************************************
// MARK: - SAVE COOKIE CONSENT
// **************************************

export function saveConsent(choice: Exclude<CookieConsent, null>) {

  if (getConsent() === choice) { return; }
  try {

    localStorage.setItem(key, JSON.stringify({ version: cookieConsentVersion, choice }));
    storageWriteFailed = false;

  } catch {

    storageWriteFailed = true;
    // Clear any previous opt-in if the storage quota only prevents writes.
    try { localStorage.removeItem(key); } catch { /* Storage access is blocked. */ }

  }
  window.dispatchEvent(new Event(event));

}

// **************************************
// MARK: - SUBSCRIBE TO COOKIE CONSENT
// **************************************

export function subscribeConsent(listener: () => void) {

  // **************************************
  // MARK: - HANDLE CONSENT STORAGE CHANGES
  // **************************************

  const onStorage = (change: StorageEvent) => {

    if (change.key !== null && change.key !== key) { return; }
    try {

      if (change.storageArea !== window.localStorage) { return; }

    } catch {
      // Subscribers still need to see that this tab cannot read consent.
    }
    listener();

  };
  window.addEventListener(event, listener);
  window.addEventListener('storage', onStorage);

  // **************************************
  // MARK: - UNSUBSCRIBE FROM COOKIE CONSENT
  // **************************************

  const cleanup = () => {

    window.removeEventListener(event, listener);
    window.removeEventListener('storage', onStorage);

  };

  return cleanup;

}
