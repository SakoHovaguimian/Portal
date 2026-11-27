import { useEffect, useRef, useState } from 'react';

import { Button, UiIcon } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

import styles from '../ExperienceScreen.module.css';
import type { ExperienceMotionPreset } from '../models/experienceMotionPreset';

const copy = strings.ui.experienceScreen;
const presets = [
  {
    id: 'fast',
    label: copy.fast,
    configuration: { enabled: true, toastDurationMs: 170, alertDurationMs: 180, sheetDurationMs: 190 },
    feedback: {
      title: copy.fastMotionPreset,
      description: copy.presentationOverlaysNowAnimateAtASnappierPaceHint,
      intent: 'success',
    },
  },
  {
    id: 'relaxed',
    label: copy.relaxed,
    configuration: { enabled: true, toastDurationMs: 280, alertDurationMs: 300, sheetDurationMs: 320 },
    feedback: {
      title: copy.relaxedMotionPreset,
      description: copy.transitionsNowRunWithSlowerTimingForACalmerHint,
      intent: 'info',
    },
  },
  {
    id: 'off',
    label: copy.disableMotion,
    configuration: { enabled: false },
    feedback: {
      title: copy.motionDisabled,
      description: copy.allPresentationAnimationsAreNowTurnedOffHint,
      intent: 'warning',
      motion: { enabled: false },
    },
  },
] as const;

export function ExperienceMotion() {

  const presentation = usePresentationService();
  const motionReset = useRef<(() => void) | null>(null);
  const [preset, setPreset] = useState<ExperienceMotionPreset | null>(null);

  useEffect(() => {

    const cleanup = () => {

      motionReset.current?.();
      motionReset.current = null;

    };

    return cleanup;

  }, []);

  async function previewMotion(choice: (typeof presets)[number]) {

    motionReset.current?.();
    motionReset.current = presentation.configureMotion(choice.configuration);
    setPreset(choice.id);
    await presentation.showToast(choice.feedback);

  }

  async function restoreMotion() {

    motionReset.current?.();
    motionReset.current = null;
    setPreset(null);
    await presentation.showAlert({
      title: copy.defaultMotionRestored,
      description: copy.toastAlertAndSheetTimingsAreBackToDefaultHint,
      tone: 'info',
      confirmLabel: copy.done,
      cancelLabel: copy.dismiss,
    });

  }

  function renderPreset(choice: (typeof presets)[number]) {

    return (
      <Button
        key={choice.id}
        variant="secondary"
        aria-pressed={preset === choice.id}
        className="aria-pressed:border-brand aria-pressed:bg-brand-primary aria-pressed:text-brand-secondary"
        onClick={() => void previewMotion(choice)}
      >
        {choice.label}
      </Button>
    );

  }

  const actions = presets.map(renderPreset);

  return (
    <section id="motion" tabIndex={-1} aria-labelledby="motion-title" className={styles.motion}>
      <header className={styles.sectionHeader}>
        <h2 id="motion-title">{copy.motionIsStillConfigurableButTheChromeAroundIt}</h2>
        <p>{copy.useTheSameControlsAsBeforeToChangeToastHint}</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {actions}
        <Button variant="ghost" onClick={() => void restoreMotion()}>
          <UiIcon name="refresh" className="size-4" />
          {copy.resetDefaults}
        </Button>
      </div>
    </section>
  );

}
