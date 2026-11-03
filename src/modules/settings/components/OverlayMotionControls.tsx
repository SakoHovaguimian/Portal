'use client';

import { useId, useRef, useState } from 'react';
import { Badge, Button, Field, Message, Select, Slider, UiIcon } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import type { PresentationMotionConfig } from '@/presentation/models/presentationMotionConfig';
import { PresentationMotionEasingSchema } from '@/presentation/models/presentationMotionEasing';
import { strings, portalOverlayMotionStrings as copy } from '@/strings';
import type { OverlayMotionDraft } from '../models/overlayMotionDraft';

export function OverlayMotionControls() {

  const presentation = usePresentationService();
  const feelDescriptionId = useId();
  const [draft, setDraft] = useState<OverlayMotionDraft>({});
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const pendingRef = useRef(false);
  const retryRef = useRef<(() => Promise<void>) | null>(null);
  const configuration = presentation.motionConfig;
  const defaults = presentation.getMotionDefaults();
  const duration = draft.durationMs ?? configuration.alertDurationMs ?? defaults.alertDurationMs;
  const scale = draft.scale ?? configuration.scale ?? defaults.scale;
  const travel = draft.travelPx ?? configuration.travelPx ?? defaults.travelPx;
  const easing = draft.easing ?? configuration.easing ?? defaults.easing;
  const customized = !configuration.enabled || [
    configuration.alertDurationMs,
    configuration.sheetDurationMs,
    configuration.toastDurationMs,
    configuration.scale,
    configuration.travelPx,
    configuration.easing,
  ].some((value) => value !== undefined);

  async function save(action: () => Promise<void>) {

    if (pendingRef.current) { return; }
    pendingRef.current = true;
    retryRef.current = action;
    setPending(true);
    setFailed(false);
    try {

      await action();
      setDraft({});
      retryRef.current = null;

    } catch {
      setFailed(true);
    } finally {

      pendingRef.current = false;
      setPending(false);

    }

  }

  function commit(patch: Partial<PresentationMotionConfig>) {

    const pendingPatch: Partial<PresentationMotionConfig> = { ...patch };
    if (draft.durationMs !== undefined) {

      pendingPatch.alertDurationMs ??= draft.durationMs;
      pendingPatch.sheetDurationMs ??= draft.durationMs;
      pendingPatch.toastDurationMs ??= draft.durationMs;

    }
    if (draft.scale !== undefined) { pendingPatch.scale ??= draft.scale; }
    if (draft.travelPx !== undefined) { pendingPatch.travelPx ??= draft.travelPx; }
    if (draft.easing !== undefined) { pendingPatch.easing ??= draft.easing; }

    function persist() {
      return presentation.setMotionConfig(pendingPatch);
    }

    void save(persist);

  }

  function reset() {

    function restoreDefaults() {
      return presentation.resetMotionConfig();
    }

    void save(restoreDefaults);

  }

  function changeFeel(value: string) {

    if (value !== 'smooth' && value !== 'spring' && value !== 'snappy') { return; }
    setDraft((current) => ({ ...current, easing: value }));
    commit({ easing: value });

  }

  function renderPreferenceSummary() {

    return (
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        <div className="grid min-w-0 gap-2">
          <Badge intent={customized ? 'brand' : 'neutral'}>{customized ? copy.custom : copy.theme}</Badge>
          <p className="m-0 text-sm text-tertiary">{copy.savedHint}</p>
        </div>
        <Button variant="secondary" disabled={pending || (!customized && !Object.keys(draft).length)} onClick={reset}>
          <UiIcon name="refresh" className="size-4" />{copy.reset}
        </Button>
      </div>
    );

  }

  function renderControls() {

    return (
      <div className="grid min-w-0 items-start gap-x-8 gap-y-6 md:grid-cols-2">
        <Slider
          label={copy.durationLabel}
          description={copy.durationHint}
          value={duration}
          min={0}
          max={1000}
          step={10}
          disabled={pending}
          formatOptions={{ style: 'unit', unit: 'millisecond', unitDisplay: 'short' }}
          onValueChange={(value) => {
            setDraft((current) => ({ ...current, durationMs: value }));
          }}
          onValueCommit={(value) => commit({ alertDurationMs: value, sheetDurationMs: value, toastDurationMs: value })}
        />
        <Slider
          label={copy.scaleLabel}
          description={copy.scaleHint}
          value={scale}
          min={0.88}
          max={1}
          step={0.01}
          disabled={pending}
          formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
          onValueChange={(value) => {
            setDraft((current) => ({ ...current, scale: value }));
          }}
          onValueCommit={(value) => commit({ scale: value })}
        />
        <Slider
          label={copy.travelLabel}
          description={copy.travelHint}
          value={travel}
          min={0}
          max={64}
          step={1}
          disabled={pending}
          onValueChange={(value) => {
            setDraft((current) => ({ ...current, travelPx: value }));
          }}
          onValueCommit={(value) => commit({ travelPx: value })}
        />
        <div className="grid min-w-0 gap-2">
          <Field labelText={copy.feelLabel}>
            <Select value={easing} disabled={pending} onValueChange={changeFeel} aria-describedby={feelDescriptionId}>
              <option value={PresentationMotionEasingSchema.enum.smooth}>{copy.smooth}</option>
              <option value={PresentationMotionEasingSchema.enum.spring}>{copy.spring}</option>
              <option value={PresentationMotionEasingSchema.enum.snappy}>{copy.snappy}</option>
            </Select>
          </Field>
          <p id={feelDescriptionId} className="m-0 text-xs text-tertiary">{copy.feelHint}</p>
        </div>
      </div>
    );

  }

  function renderFeedback() {

    return (
      <>
        {presentation.reducedMotion && <Message intent="neutral" title={copy.reducedTitle} description={copy.reducedHint} />}
        {!presentation.reducedMotion && !configuration.enabled && <Message intent="neutral" title={copy.disabledTitle} description={copy.disabledHint} />}
        {failed && (
          <Message
            intent="danger"
            title={copy.failedTitle}
            description={copy.failedHint}
            action={<Button variant="secondary" disabled={pending} onClick={() => {

              if (retryRef.current) { void save(retryRef.current); }

            }}>{copy.retry}</Button>}
          />
        )}
      </>
    );

  }

  function renderPreviews() {

    return (
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 border-t-control border-secondary pt-5">
        <div className="grid gap-1">
          <h3 className="m-0 text-sm font-semibold text-primary">{copy.previewTitle}</h3>
          <p className="m-0 text-sm text-tertiary">{copy.previewHint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={pending || failed} onClick={() => {
            void presentation.showToast({ title: copy.previewToastTitle, description: copy.previewToastDescription, intent: 'info' });
          }}>{copy.previewToast}</Button>
          <Button variant="secondary" disabled={pending || failed} onClick={() => {
            void presentation.showAlert({ title: copy.previewAlertTitle, description: copy.previewAlertDescription, confirmLabel: copy.close, cancelLabel: strings.ui.alertModal.cancel });
          }}>{copy.previewAlert}</Button>
          <Button variant="secondary" disabled={pending || failed} onClick={() => {
            void presentation.showSheet({ title: copy.previewSheetTitle, description: copy.previewSheetDescription, content: copy.previewSheetBody, side: 'right', confirmLabel: copy.close, cancelLabel: strings.ui.alertModal.cancel });
          }}>{copy.previewSheet}</Button>
        </div>
      </div>
    );

  }

  return (
    <div className="grid min-w-0 gap-6" aria-busy={pending || undefined}>
      {renderPreferenceSummary()}
      {renderControls()}
      {renderFeedback()}
      {renderPreviews()}
    </div>
  );

}
