'use client';
import { usePathname } from 'next/navigation';

import { CookieConsentControls } from './CookieConsentControls';

export function CookieConsentBanner() {

  const pathname = usePathname();
  if (pathname === '/privacy' || pathname === '/settings/appearance') { return null; }
  return <CookieConsentControls key={pathname} />;

}
