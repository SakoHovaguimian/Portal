import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    enabled: Boolean(process.env.SENTRY_DSN),
  });
}
