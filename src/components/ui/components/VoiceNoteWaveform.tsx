import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';

import styles from './VoiceNote.module.css';

export function VoiceNoteWaveform({
  levels,
  bars,
  gain,
  recording,
  position,
}: {
  levels: readonly number[];
  bars: number;
  gain: number;
  recording?: boolean;
  position?: number;
}) {

  const samples = Array.from({ length: bars }, (_, index) => {

    let level = 0;
    if (recording) {
      level = levels[levels.length - bars + index] ?? 0;
    } else {

      const from = Math.floor(index * levels.length / bars);
      const to = Math.max(from + 1, Math.floor((index + 1) * levels.length / bars));
      for (let sample = from; sample < to; sample += 1) {
        level = Math.max(level, levels[sample] ?? 0);
      }

    }
    return (
      <span
        key={index}
        className={styles.bar}
        style={{ '--voice-level': Math.min(1, gain * level), '--voice-index': index } as CSSProperties}
      />
    );

  });

  return (
    <span
      aria-hidden="true"
      className={cn(styles.waveform, recording && styles.recordingWave)}
      style={{ '--voice-bars': bars, '--voice-position': position ?? 0 } as CSSProperties}
    >
      {samples}
    </span>
  );

}
