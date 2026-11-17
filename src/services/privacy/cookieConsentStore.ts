'use client';
import type { CookieConsent } from './models/cookieConsent';

const key = 'portal-analytics-consent';
const event = 'portal:consent';

// **************************************
// MARK: - GET COOKIE CONSENT
// **************************************

export function getConsent(): CookieConsent {

  try {

    const value = localStorage.getItem(key);
    return value === 'accepted' || value === 'declined' ? value : null;

  } catch {
    return null;
  }

}

// **************************************
// MARK: - SAVE COOKIE CONSENT
// **************************************

export function saveConsent(value: Exclude<CookieConsent, null>) {

  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(event));

}

// **************************************
// MARK: - SUBSCRIBE TO COOKIE CONSENT
// **************************************

export function subscribeConsent(listener: () => void) {

  window.addEventListener(event, listener);
  window.addEventListener('storage', listener);

  // **************************************
  // MARK: - UNSUBSCRIBE FROM COOKIE CONSENT
  // **************************************

  const cleanup = () => {

    window.removeEventListener(event, listener);
    window.removeEventListener('storage', listener);

  };

  return cleanup;

}
