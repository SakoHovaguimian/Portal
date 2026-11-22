'use client';

import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { useStepPlayback } from '../lib/useStepPlayback';
import type { StepPlayerProps } from '../models/stepPlayerProps';
import { interactiveComponentStrings } from '@/strings';

import { Button } from './Button';
import { IconButton } from './IconButton';
import styles from './StepPlayer.module.css';
import { UiIcon } from './UiIcon';

const copy = interactiveComponentStrings.stepPlayer;

export function StepPlayer({
  steps = 4,
  value,
  defaultValue,
  onValueChange,
  playing,
  defaultPlaying,
  onPlayingChange,
  duration,
  loop,
  onComplete,
  size,
  showControl = true,
  controlPosition = 'right',
  seekable = false,
  disabled = false,
  className,
  style,
  ...props
}: StepPlayerProps) {

  const { count, index, isPlaying, finished, trackRef, seek, togglePlaying } = useStepPlayback({
    steps, value, defaultValue, onValueChange, playing, defaultPlaying, onPlayingChange,
    duration, loop, onComplete, disabled,
  });
  if (!count) { return null; }
  const transport = finished ? 'replay' : isPlaying ? 'pause' : 'play';
  const controlLabel = finished ? copy.replayAction : isPlaying ? copy.pauseAction : copy.playAction;

  function renderStep(_: unknown, stepIndex: number) {

    const active = index === stepIndex;
    const state = active ? 'active' : stepIndex < index ? 'past' : 'pending';
    const label = typeof steps === 'number' ? undefined : steps[stepIndex]?.label;
    const className = cn(styles.step, seekable && 'rounded-control p-0');
    const mark = (
      <span aria-hidden="true" className={styles.mark}>
        {active && <span className={styles.fill} data-slot="step-player-fill" />}
      </span>
    );

    return seekable ? (
      <Button
        key={stepIndex}
        variant="ghost"
        className={className}
        data-slot="step-player-step"
        data-state={state}
        aria-label={label ?? copy.stepLabel(stepIndex + 1)}
        aria-current={active ? 'step' : undefined}
        disabled={disabled}
        onClick={() => seek(stepIndex)}
      >
        {mark}
      </Button>
    ) : (
      <span key={stepIndex} className={className} data-slot="step-player-step" data-state={state}>
        {mark}
      </span>
    );

  }

  const stepItems = Array.from({ length: count }, renderStep);

  function renderControl() {

    return (
      <IconButton
        label={controlLabel}
        className={styles.control}
        data-slot="step-player-control"
        data-transport={transport}
        disabled={disabled}
        onClick={togglePlaying}
      >
        <span aria-hidden="true" className={styles.icon}>
          <span className={styles.transportGlyph} />
          <UiIcon name="refresh" className={styles.replayGlyph} />
        </span>
      </IconButton>
    );

  }

  function renderTrack() {

    return (
      <div
        ref={trackRef}
        data-slot="step-player-track"
        role="group"
        aria-label={copy.position(index + 1, count)}
        className={cn(styles.track, 'rounded-control border-control border-secondary bg-secondary')}
      >
        {stepItems}
      </div>
    );

  }

  return (
    <div
      {...props}
      data-slot="step-player"
      data-playing={isPlaying || undefined}
      data-finished={finished || undefined}
      style={{
        '--step-player-size': typeof size === 'number' && Number.isFinite(size) ? `${size}px` : undefined,
        ...style,
      } as CSSProperties}
      className={cn(styles.player, className)}
    >
      {showControl && controlPosition === 'left' && renderControl()}
      {renderTrack()}
      {showControl && controlPosition === 'right' && renderControl()}
    </div>
  );

}
