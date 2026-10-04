'use client';
import { useEffect } from 'react';
export function SessionKeepAlive() {
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      void fetch('/api/auth/session', {
        cache: 'no-store',
        signal: controller.signal,
      })
        .then((response) => {
          if (response.status === 401)
            window.location.replace(
              `/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`,
            );
        })
        .catch(() => undefined);
    };
    refresh();
    const timer = setInterval(refresh, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return null;
}
