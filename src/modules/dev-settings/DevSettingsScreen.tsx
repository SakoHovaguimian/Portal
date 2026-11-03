'use client';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Field,
  FormActions,
  InlineLoading,
  Input,
  Message,
  Page,
  PageHeader,
  QueryBoundary,
  SectionStack,
  Select,
  SplitSection,
  Switch,
} from '@/components/ui';
import type { DemoSettings } from '@/models/demoSettings';
import { DemoContextSchema } from '@/models/demoContext';
import {
  DemoPresetSchema,
  type DemoPreset,
} from '@/services/demo/models/demoPreset';
import { portalDemoStrings as copy } from '@/strings';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { useDevSettings, useDevSettingsCommand } from './hooks';
import type { DevSettingsCommand } from './models/devSettingsCommand';
export function DevSettingsScreen() {
  const query = useDevSettings();
  return (
    <Page>
      <PageHeader title={copy.title} description={copy.description} />
      <QueryBoundary query={query} loadingFallback={<InlineLoading />}>
        {(settings) => (
          <DevSettingsForm
            key={`${settings.demoMode}-${settings.scenario}-${settings.latencyMs}`}
            settings={settings}
          />
        )}
      </QueryBoundary>
    </Page>
  );
}
function DevSettingsForm({ settings }: { settings: DemoSettings }) {
  const [demoMode, setDemoMode] = useState(settings.demoMode);
  const [scenario, setScenario] = useState(settings.scenario);
  const [latencyMs, setLatencyMs] = useState(String(settings.latencyMs));
  const [preset, setPreset] = useState<DemoPreset>(
    settings.role === 'user' ? 'populated' : settings.role,
  );
  const mutation = useDevSettingsCommand();
  const presentation = usePresentationService();
  const queryClient = useQueryClient();
  const dirty =
    demoMode !== settings.demoMode ||
    scenario !== settings.scenario ||
    latencyMs !== String(settings.latencyMs);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  useEffect(() => {
    dirtyRef.current = dirty;
    busyRef.current = mutation.isPending;
  }, [dirty, mutation.isPending]);
  useUnsavedFormGuard(dirtyRef, busyRef);
  async function run(command: DevSettingsCommand) {
    if (mutation.isPending) return;
    if (command.kind === 'preset' || command.kind === 'reset') {
      const confirmed = await presentation.showAlert({
        title:
          command.kind === 'preset'
            ? copy.roleConfirmationTitle
            : copy.resetConfirmationTitle,
        description:
          command.kind === 'preset'
            ? copy.roleConfirmationDescription
            : copy.resetConfirmationDescription,
        confirmLabel:
          command.kind === 'preset' ? copy.switchAction : copy.resetAction,
        cancelLabel: copy.cancelAction,
        tone: command.kind === 'reset' ? 'danger' : 'warning',
      });
      if (!confirmed) return;
    }
    try {
      const result = await mutation.mutateAsync(command);
      dirtyRef.current = false;
      busyRef.current = false;
      if (result.reload) {
        queryClient.clear();
        window.location.assign(
          command.kind === 'update'
            ? '/login'
            : command.kind === 'preset' && command.preset === 'onboarding'
              ? '/onboarding'
              : '/dev-settings',
        );
        return;
      }
      await queryClient.invalidateQueries();
      void presentation.showToast({
        title: copy.savedTitle,
        description: copy.savedDescription,
        intent: 'success',
      });
    } catch {
      /* Keep selected values available for retry. */
    }
  }
  const validLatency =
    latencyMs !== '' &&
    Number.isInteger(Number(latencyMs)) &&
    Number(latencyMs) >= 0 &&
    Number(latencyMs) <= 5000;
  return (
    <div className="grid gap-6">
      <Message
        title={settings.demoMode ? copy.demoModeStatus : copy.liveModeStatus}
        description={copy.demoModeDescription}
        intent={settings.demoMode ? 'info' : 'warning'}
      />
      <form
        noValidate
        className="grid gap-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (validLatency)
            void run({
              kind: 'update',
              input: { demoMode, scenario, latencyMs: Number(latencyMs) },
            });
        }}
      >
        <SectionStack>
          <SplitSection
            id="demo-runtime"
            title={copy.runtimeTitle}
            description={copy.runtimeDescription}
          >
            <Switch
              label={copy.demoModeLabel}
              description={copy.demoModeDescription}
              checked={demoMode}
              disabled={mutation.isPending}
              onChange={(event) => setDemoMode(event.target.checked)}
            />
          </SplitSection>
          <SplitSection
            id="demo-simulation"
            title={copy.scenarioTitle}
            description={copy.scenarioDescription}
          >
            <Field labelText={copy.scenarioLabel}>
              <Select
                value={scenario}
                disabled={!demoMode || mutation.isPending}
                onValueChange={(value) =>
                  setScenario(DemoContextSchema.shape.scenario.parse(value))
                }
              >
                {Object.entries(copy.scenarios).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field labelText={copy.latencyLabel}>
              <Input
                type="number"
                min={0}
                max={5000}
                step={1}
                value={latencyMs}
                disabled={!demoMode || mutation.isPending}
                onChange={(event) => setLatencyMs(event.target.value)}
                aria-invalid={!validLatency}
                aria-describedby="demo-latency-hint"
              />
            </Field>
            <p id="demo-latency-hint" className="m-0 text-sm text-secondary">
              {copy.latencyHint}
            </p>
          </SplitSection>
        </SectionStack>
        <FormActions sticky={false}>
          <Button
            type="submit"
            disabled={!dirty || !validLatency}
            loading={
              mutation.isPending && mutation.variables?.kind === 'update'
            }
          >
            {copy.applyAction}
          </Button>
        </FormActions>
      </form>
      {mutation.isError && (
        <Message
          title={copy.errorTitle}
          description={mutation.error.message || copy.errorDescription}
          intent="danger"
        />
      )}
      <SectionStack>
        <SplitSection
          id="demo-account"
          title={copy.roleTitle}
          description={
            settings.demoMode
              ? copy.roleDescription
              : copy.roleUnavailableDescription
          }
        >
          <Field labelText={copy.accountLabel}>
            <Select
              value={preset}
              disabled={!settings.demoMode || mutation.isPending}
              onValueChange={(value) =>
                setPreset(DemoPresetSchema.parse(value))
              }
            >
              {Object.entries(copy.accounts).map(([key, account]) => (
                <option key={key} value={key}>
                  {account.label}
                </option>
              ))}
            </Select>
          </Field>
          <p className="m-0 text-sm text-secondary">
            {copy.accounts[preset].description}
          </p>
          <p className="m-0 break-all text-sm text-secondary">
            {copy.accounts[preset].email}
          </p>
          <div>
            <Button
              variant="secondary"
              disabled={!settings.demoMode || mutation.isPending}
              loading={
                mutation.isPending && mutation.variables?.kind === 'preset'
              }
              onClick={() => void run({ kind: 'preset', preset })}
            >
              {copy.switchAction}
            </Button>
          </div>
        </SplitSection>
        <SplitSection
          id="demo-reset"
          title={copy.resetTitle}
          description={copy.resetDescription}
        >
          <div>
            <Button
              variant="destructive"
              disabled={!settings.demoMode || mutation.isPending}
              loading={
                mutation.isPending && mutation.variables?.kind === 'reset'
              }
              onClick={() => void run({ kind: 'reset' })}
            >
              {copy.resetAction}
            </Button>
          </div>
        </SplitSection>
      </SectionStack>
    </div>
  );
}
