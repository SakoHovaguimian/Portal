'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Field, Input, SegmentedPanels, Select, Slider, type ToastPosition } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.designSystem;
const panels = { edit: 'edit', preview: 'preview' } as const;
export function MotionShowcase() {

  const [position, setPosition] = useState<ToastPosition>('top-right');
  const previewTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {

    const timers = previewTimers.current;
    const cleanup = () => timers.forEach(clearTimeout);
    return cleanup;

  }, []);
  const presentation = usePresentationService();
  const [duration, setDuration] = useState(240);
  const [panel, setPanel] = useState<'edit' | 'preview'>('edit');
  const [draft, setDraft] = useState<string>(copy.draftSample);
  const motion = { durationMs: duration };

  function previewStack() {

    previewTimers.current.forEach(clearTimeout);
    previewTimers.current.length = 0;
    const examples = [
      { title: copy.stackSavedTitle, description: copy.stackSavedDescription },
      { title: copy.stackUpdatedTitle, description: copy.stackUpdatedDescription },
      { title: copy.stackReadyTitle, description: copy.stackReadyDescription },
    ];
    examples.forEach((example, index) => {

      previewTimers.current.push(setTimeout(() => {
        void presentation.showToast({ ...example, position, intent: 'success', durationMs: 12000, motion });
      }, index * 500));

    });

  }

  const positionOptions = Object.entries(copy.toastPositions).map(([value, label]) => <option key={value} value={value}>{label}</option>);
  return (
    <ShowcaseSection
      id="motion"
      title={copy.motion}
      description={copy.panelsHint}
      icon="sparkles"
    >
      <SegmentedPanels
        label={copy.panels}
        value={panel}
        onValueChange={setPanel}
        panels={[
          {
            value: panels.edit,
            label: copy.edit,
            content: (
              <Field labelText={copy.draftLabel}>
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </Field>
            ),
          },
          {
            value: panels.preview,
            label: copy.preview,
            content: (
              <p className="m-0 text-lg text-primary wrap-anywhere">
                {draft || copy.draftSample}
              </p>
            ),
          },
        ]}
      />
      <div className="grid gap-3">
        <Slider
          label={copy.overlayTiming}
          description={copy.timingHint}
          min={0}
          max={700}
          step={10}
          value={duration}
          onValueChange={setDuration}
          formatOptions={{ style: 'unit', unit: 'millisecond', unitDisplay: 'short' }}
        />
        <Field labelText={copy.toastPosition}>
          <Select value={position} onValueChange={(value) => setPosition(value as ToastPosition)}>{positionOptions}</Select>
        </Field>
        <p className="m-0 text-sm text-secondary">{copy.toastStackHint}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={previewStack}>{copy.toastStack}</Button>
          <Button
            variant="secondary"
            onClick={() =>
              void presentation.showToast({
                title: strings.componentLibrary.successTitle,
                description: strings.componentLibrary.localPreviewHint,
                intent: 'success',
                position,
                motion,
              })
            }
          >
            {copy.showToast}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              void presentation.showAlert({
                title: copy.showAlert,
                description: copy.timingHint,
                confirmLabel: copy.close,
                cancelLabel: strings.ui.alertModal.cancel,
                motion,
              })
            }
          >
            {copy.showAlert}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              void presentation.showSheet({
                title: copy.showSheet,
                description: copy.timingHint,
                content: copy.panelsHint,
                confirmLabel: copy.close,
                cancelLabel: strings.ui.alertModal.cancel,
                motion,
              })
            }
          >
            {copy.showSheet}
          </Button>
          <Button variant="secondary" onClick={() => {
            void presentation.showSheet({ title: copy.previewBottomSheet, description: copy.timingHint, content: copy.panelsHint, side: 'bottom', confirmLabel: copy.close, cancelLabel: strings.ui.alertModal.cancel, motion });
          }}>{copy.previewBottomSheet}</Button>
          <Button variant="ghost" onClick={() => setDuration(240)}>
            {copy.reset}
          </Button>
        </div>
      </div>
    </ShowcaseSection>
  );

}
