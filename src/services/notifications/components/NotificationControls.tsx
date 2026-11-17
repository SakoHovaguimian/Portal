'use client';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { useRealtime } from '@/services/realtime/RealtimeProvider';
import { strings, portalDemoStrings as copy } from '@/strings';

export function NotificationControls() {

  const realtime = useRealtime();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const state = realtime.notificationStatus;
  const enabled = state === 'enabled' || state === 'demo-enabled';
  const available = state === 'available' || state === 'demo' || enabled;
  const statusDescriptions = {
    enabled: strings.notifications.enabled,
    available: strings.notifications.availableHint,
    denied: strings.notifications.deniedHint,
    unsupported: strings.notifications.unsupportedHint,
    unconfigured: strings.notifications.unconfiguredHint,
  };
  const description =
    state === 'demo'
      ? copy.notificationsAvailableHint
      : state === 'demo-enabled'
        ? copy.notificationsEnabledHint
        : statusDescriptions[state];

  function renderNotificationAction() {

    return (
      available && (
        <Button
          variant="secondary"
          disabled={pending}
          loading={pending}
          onClick={async () => {

            setPending(true);
            setError('');
            try {

              if (enabled) { await realtime.disableNotifications(); } else { await realtime.enableNotifications(); }

            } catch {
              setError(strings.notifications.failedHint);
            } finally {
              setPending(false);
            }

          }}
        >
          {enabled
            ? strings.notifications.disable
            : strings.notifications.enable}
        </Button>
      )
    );

  }

  function renderFailure() {

    return (
      error && (
        <p role="alert" className="text-sm text-error-primary">
          {error}
        </p>
      )
    );

  }

  return (
    <section className="grid gap-3" aria-label={strings.notifications.title}>
      <h2 className="font-semibold">{strings.notifications.title}</h2>
      <p className="text-sm text-secondary">{description}</p>
      {renderNotificationAction()}
      {renderFailure()}
    </section>
  );

}
