import { useEffect, useRef, useState } from 'react';

import { interactiveComponentStrings as strings } from '@/strings';

import type { VoiceNoteClip } from '../models/voiceNoteClip';

import { IconButton } from './IconButton';
import { UiIcon } from './UiIcon';
import { VoiceNoteWaveform } from './VoiceNoteWaveform';
import styles from './VoiceNote.module.css';

const copy = strings.voice;

export function VoiceNoteClipPlayer({
  clip,
  bars,
  gain,
  disabled,
  onClear,
  restoreFocus,
}: {
  clip: VoiceNoteClip;
  bars: number;
  gain: number;
  disabled?: boolean;
  onClear: () => void;
  restoreFocus: boolean;
}) {

  const audio = useRef<HTMLAudioElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(clip.durationMs / 1000);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {

    const element = audio.current;
    if (!element) { return; }
    const url = URL.createObjectURL(clip.blob);
    element.src = url;
    const disposeAudio = () => {

      element.pause();
      element.removeAttribute('src');
      element.load();
      URL.revokeObjectURL(url);

    };

    return disposeAudio;

  }, [clip]);

  useEffect(() => {

    if (restoreFocus && !disabled) { play.current?.focus({ preventScroll: true }); }

  }, [restoreFocus, disabled]);

  useEffect(() => {

    if (disabled) { audio.current?.pause(); }

  }, [disabled]);

  function togglePlayback() {

    const element = audio.current;
    if (!element) { return; }
    if (!element.paused) {

      element.pause();
      return;

    }
    if (element.ended || element.currentTime >= duration) { element.currentTime = 0; }
    void element.play().catch(() => setFailed(true));

  }

  function updateDuration(event: React.SyntheticEvent<HTMLAudioElement>) {

    const seconds = event.currentTarget.duration;
    if (Number.isFinite(seconds) && seconds > 0) { setDuration(seconds); }

  }

  return (
    <>
      <div className={styles.player}>
        <audio
          ref={audio}
          preload="metadata"
          onLoadedMetadata={updateDuration}
          onDurationChange={updateDuration}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
        <IconButton
          ref={play}
          label={playing ? copy.pauseAction : copy.playAction}
          disabled={disabled || failed}
          onClick={togglePlayback}
        >
          <UiIcon name={playing ? 'pause' : 'play'} />
        </IconButton>
        <div className={styles.seek}>
          <VoiceNoteWaveform levels={clip.levels} bars={bars} gain={gain} position={Math.min(1, time / duration)} />
          <input
            type="range"
            min={0}
            max={duration}
            step={Math.min(0.05, duration / 100)}
            value={Math.min(time, duration)}
            disabled={disabled || failed}
            aria-label={copy.seekLabel}
            aria-valuetext={copy.seekValue(time * 1000, duration * 1000)}
            className={styles.slider}
            onChange={(event) => {

              const next = event.currentTarget.valueAsNumber;
              if (audio.current) { audio.current.currentTime = next; }
              setTime(next);

            }}
          />
        </div>
        <span className={styles.time}>{copy.durationValue((time && time < duration ? time : duration) * 1000)}</span>
        <IconButton label={copy.discardAction} disabled={disabled} variant="ghost" onClick={onClear}>
          <UiIcon name="close" />
        </IconButton>
      </div>
      {failed && <p role="alert" className="m-0 text-sm text-error-primary">{copy.playbackMessage}</p>}
    </>
  );

}
