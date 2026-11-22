import { useEffectEvent, useLayoutEffect, useRef, useState } from 'react';

import type { StepPlayerProps } from '../models/stepPlayerProps';

import { useInteractionAnimation } from './useInteractionAnimation';

function clampStep(value: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(0, Math.trunc(value))) : 0;
}

function stepDuration(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function useStepPlayback({
  steps = 4,
  value,
  defaultValue = 0,
  playing,
  defaultPlaying = false,
  onValueChange,
  onPlayingChange,
  duration = 4000,
  loop = false,
  onComplete,
  disabled = false,
}: StepPlayerProps) {

  const count = typeof steps === 'number' ? clampStep(steps, 1000) : steps.length;
  const [localIndex, setLocalIndex] = useState(defaultValue);
  const [localPlaying, setLocalPlaying] = useState(defaultPlaying);
  const index = clampStep(value ?? localIndex, Math.max(0, count - 1));
  const [cycle, setCycle] = useState({ index, count, revision: 0, finished: false });
  if (cycle.index !== index || cycle.count !== count) {
    setCycle({ index, count, revision: cycle.revision + 1, finished: false });
  }
  const { revision, finished } = cycle;
  const requestedPlaying = playing ?? localPlaying;
  const isPlaying = requestedPlaying && !finished && !disabled && count > 0;
  const step = typeof steps === 'number' ? undefined : steps[index];
  const durationMs = stepDuration(step?.duration ?? duration, stepDuration(duration, 4000));
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const clock = useInteractionAnimation();

  function select(next: number) {

    if (next === index) {
      setCycle({ index, count, revision: revision + 1, finished: false });
    } else {

      if (value === undefined) { setLocalIndex(next); }
      onValueChange?.(next);

    }

  }

  function setPlaying(next: boolean) {

    if (next === requestedPlaying) { return; }
    if (playing === undefined) { setLocalPlaying(next); }
    onPlayingChange?.(next);

  }

  function seek(next: number) {

    if (disabled) { return; }
    select(next);
    setPlaying(true);

  }

  function togglePlaying() {

    if (disabled) { return; }
    if (finished) {

      seek(0);
      return;

    }
    setPlaying(!isPlaying);

  }

  const advance = useEffectEvent(() => {

    if (index < count - 1) {

      select(index + 1);
      return;

    }
    if (loop) {
      select(0);
    } else {

      setCycle({ index, count, revision, finished: true });
      setPlaying(false);

    }
    onComplete?.();

  });

  useLayoutEffect(() => {

    progress.current = 0;
    trackRef.current?.style.removeProperty('--step-player-progress');

  }, [revision]);

  const { run, stop } = clock;
  useLayoutEffect(() => {

    const track = trackRef.current;
    if (!track || !isPlaying || progress.current === 1) { return; }

    function syncClock() {

      stop();
      if (document.hidden || progress.current === 1) { return; }
      const start = progress.current;
      run((elapsed) => {

        const position = Math.min(1, start + elapsed / durationMs);
        progress.current = position;
        track?.style.setProperty('--step-player-progress', String(position));
        if (position === 1) { advance(); }
        return position < 1;

      });

    }

    syncClock();
    document.addEventListener('visibilitychange', syncClock);
    const cleanup = () => {

      document.removeEventListener('visibilitychange', syncClock);
      stop();

    };

    return cleanup;

  }, [durationMs, isPlaying, revision, run, stop]);

  return { count, index, isPlaying, finished, trackRef, seek, togglePlaying };

}
