'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Message } from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { portalDemoStrings as copy } from '@/strings';
import { devSettingsQueryKey, useDevSettings, useDevSettingsCommand } from '../hooks';

export function DemoSimulationNotice() {

  const runtime = useRuntimeConfig();
  const settings = useDevSettings(runtime.demoMode && Boolean(runtime.devSettingsEnabled));
  const mutation = useDevSettingsCommand();
  const queryClient = useQueryClient();
  const [failed, setFailed] = useState(false);
  const current = settings.data;
  if (!runtime.demoMode || !current?.demoMode || (current.scenario === 'populated' && !current.latencyMs)) { return null; }
  const delay = current.scenario === 'loading' ? Math.max(2500, current.latencyMs) : current.latencyMs;

  async function restore() {

    if (mutation.isPending || !current) { return; }
    setFailed(false);
    try {

      await mutation.mutateAsync({ kind: 'update', input: { demoMode: true, scenario: 'populated', latencyMs: 0 } });
      await queryClient.cancelQueries();
      queryClient.setQueryData(devSettingsQueryKey, { ...current, scenario: 'populated', latencyMs: 0 });
      void queryClient.invalidateQueries();

    } catch { setFailed(true); }

  }

  return (
    <Message
      title={copy.simulationActive}
      description={failed ? copy.simulationRestoreFailed : copy.simulationDescription(copy.scenarios[current.scenario], delay)}
      intent="info"
      action={<Button variant="secondary" loading={mutation.isPending} onClick={() => void restore()}>{copy.normalResponses}</Button>}
    />
  );

}
