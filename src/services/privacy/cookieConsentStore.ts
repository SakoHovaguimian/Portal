'use client';
import type { CookieConsent } from './models/cookieConsent';
const key = 'portal-analytics-consent';
const event = 'portal:consent';
export function getConsent(): CookieConsent {
  try {
    const value = localStorage.getItem(key);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    return null;
  }
}
export function saveConsent(value: Exclude<CookieConsent, null>) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(event));
}
export function subscribeConsent(listener: () => void) {
  window.addEventListener(event, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(event, listener);
    window.removeEventListener('storage', listener);
  };
}
