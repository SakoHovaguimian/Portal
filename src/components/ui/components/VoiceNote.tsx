'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { usePointerDrag } from '../lib/usePointerDrag';
import { useVoiceNoteRecorder } from '../lib/useVoiceNoteRecorder';
import type { VoiceNoteProps } from '../models/voiceNoteProps';
import { interactiveComponentStrings as strings } from '@/strings';

import { Button } from './Button';
import { UiIcon } from './UiIcon';
import { VoiceNoteClipPlayer } from './VoiceNoteClipPlayer';
import { VoiceNoteWaveform } from './VoiceNoteWaveform';
import styles from './VoiceNote.module.css';

const copy = strings.voice;

export function VoiceNote({
  label,
  onClipChange,
  captureSource,
  interaction = 'hold',
  minDurationMs = 450,
  maxDurationMs = 30_000,
  cancelDistance = 85,
  bars = 28,
  sensitivity = 60,
  bounce = 40,
  disabled,
  className,
}: VoiceNoteProps) {

  const min = Number.isFinite(minDurationMs) ? Math.max(100, minDurationMs) : 450;
  const max = Number.isFinite(maxDurationMs) ? Math.max(min, maxDurationMs) : Math.max(min, 30_000);
  const { phase, error, clip, meter, begin, finish, clear } = useVoiceNoteRecorder({
    captureSource,
    minDurationMs: min,
    maxDurationMs: max,
    disabled,
    onClipChange,
  });
  const [pull, setPull] = useState(0);
  const record = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const [startedWithKey, setStartedWithKey] = useState(false);
  const count = Number.isFinite(bars) ? Math.min(64, Math.max(8, Math.round(bars))) : 28;
  const gain = 0.4 + Math.min(100, Math.max(0, sensitivity)) * 0.016;
  const distance = Number.isFinite(cancelDistance) ? Math.max(24, cancelDistance) : 85;
  const recording = !disabled && phase === 'recording';
  const active = !disabled && phase !== 'idle';
  const armed = pull >= distance;
  const hold = interaction === 'hold';

  useEffect(() => {

    if (!clip && returnFocus.current) {

      returnFocus.current = false;
      record.current?.focus({ preventScroll: true });

    }

  }, [clip]);

  const drag = usePointerDrag<HTMLButtonElement>({
    disabled: disabled || !hold || startedWithKey,
    onStart(event) {

      if (phase !== 'idle') { return; }
      event.currentTarget.focus({ preventScroll: true });
      setStartedWithKey(false);
      setPull(0);
      void begin();

    },
    onMove(_, { dx }) {

      if (active) { setPull(Math.max(0, Math.min(distance, -dx))); }

    },
    onEnd(_, { dx }, canceled) {

      setPull(0);
      finish(canceled || -dx >= distance);

    },
  });

  function renderRecordButton() {

    return (
      <Button
        {...drag}
        ref={record}
        variant="secondary"
        className={cn(styles.record, hold && styles.hold)}
        disabled={disabled}
        aria-disabled={phase === 'finishing' || undefined}
        aria-pressed={active}
        aria-label={active ? copy.stopAction : label ?? (hold ? copy.holdAction : copy.recordAction)}
        onContextMenu={hold ? (event) => event.preventDefault() : undefined}
        onKeyDown={(event) => {

          if (event.key === 'Escape' && active) {

            event.preventDefault();
            event.stopPropagation();
            setPull(0);
            finish(true);

          }

        }}
        onClick={(event) => {

          if (phase === 'finishing' || (hold && event.detail !== 0)) { return; }
          if (active) {

            finish();
            return;

          }
          setStartedWithKey(event.detail === 0);
          void begin();

        }}
      >
        {recording ? (
          <span className={styles.recording} style={{ translate: `${pull * -0.35}px 0` }}>
            <UiIcon name={armed ? 'close' : 'microphone'} className="size-4 text-error-primary" />
            <span className={styles.time}>{copy.durationValue(meter.elapsed)}</span>
            <VoiceNoteWaveform levels={meter.levels} bars={count} gain={gain} recording />
          </span>
        ) : (
          <>
            <UiIcon name="microphone" className="size-4" />
            {phase === 'requesting'
              ? copy.requestingStatus
              : phase === 'finishing'
                ? copy.finishingStatus
                : label ?? (hold ? copy.holdAction : copy.recordAction)}
          </>
        )}
      </Button>
    );

  }

  return (
    <div className={cn('grid min-w-0 justify-items-start gap-2', className)}>
      <div
        className={styles.shell}
        data-active={active || !!clip || undefined}
        style={{ '--voice-bounce': 1 + Math.min(100, Math.max(0, bounce)) * 0.005 } as CSSProperties}
      >
        {clip ? (
          <VoiceNoteClipPlayer
            clip={clip}
            bars={count}
            gain={gain}
            disabled={disabled}
            restoreFocus={startedWithKey}
            onClear={() => {

              returnFocus.current = true;
              clear();

            }}
          />
        ) : renderRecordButton()}
      </div>
      {recording && (
        <span role="status" className="text-xs text-tertiary">
          {hold && !startedWithKey ? (armed ? copy.releaseHint : copy.slideHint) : copy.stopHint}
        </span>
      )}
      {error && <p role="alert" className="m-0 text-sm text-error-primary">{error}</p>}
    </div>
  );

}
