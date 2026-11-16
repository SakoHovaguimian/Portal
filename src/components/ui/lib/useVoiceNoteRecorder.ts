import { useEffect, useRef, useState } from 'react';

import { interactiveComponentStrings as strings } from '@/strings';

import type { VoiceNoteCaptureSource } from '../models/voiceNoteCaptureSource';
import type { VoiceNoteClip } from '../models/voiceNoteClip';

const copy = strings.voice;
const sampleInterval = 65;

interface Recording {
  controller: AbortController;
  recorder?: MediaRecorder;
  stream?: MediaStream;
  context?: AudioContext;
  interval?: number;
  timeout?: number;
  started?: number;
  levels: number[];
  chunks: Blob[];
}

function release(recording: Recording) {

  recording.controller.abort();
  window.clearInterval(recording.interval);
  window.clearTimeout(recording.timeout);
  if (recording.recorder) {

    recording.recorder.ondataavailable = null;
    recording.recorder.onstop = null;
    recording.recorder.onerror = null;
    if (recording.recorder.state !== 'inactive') { recording.recorder.stop(); }

  }
  recording.stream?.getTracks().forEach((track) => track.stop());
  if (recording.context && recording.context.state !== 'closed') {
    void recording.context.close().catch(() => undefined);
  }

}

function silentLevel() {
  return 0;
}

function readLevel(analyser?: AnalyserNode) {

  if (!analyser) { return silentLevel; }
  const waveform = new Uint8Array(analyser.fftSize);
  const sample = () => {

    analyser.getByteTimeDomainData(waveform);
    let energy = 0;
    for (const point of waveform) {
      energy += ((point - 128) / 128) ** 2;
    }
    return Math.min(1, Math.sqrt(energy / waveform.length) * 3.5);

  };

  return sample;

}

export function useVoiceNoteRecorder({
  captureSource,
  minDurationMs,
  maxDurationMs,
  disabled,
  onClipChange,
}: {
  captureSource?: VoiceNoteCaptureSource;
  minDurationMs: number;
  maxDurationMs: number;
  disabled?: boolean;
  onClipChange?: (clip: VoiceNoteClip | null) => void;
}) {

  const [phase, setPhase] = useState<'idle' | 'requesting' | 'recording' | 'finishing'>('idle');
  const [error, setError] = useState<string>();
  const [clip, setClip] = useState<VoiceNoteClip | null>(null);
  const [meter, setMeter] = useState({ elapsed: 0, levels: [] as number[] });
  const active = useRef<Recording | null>(null);

  useEffect(() => {

    const disposeRecorder = () => {

      const recording = active.current;
      active.current = null;
      if (recording) { release(recording); }

    };

    return disposeRecorder;

  }, []);

  useEffect(() => {

    if (!disabled || !active.current) { return; }
    const recording = active.current;
    active.current = null;
    release(recording);
    // The derived display still hides an inactive session while the control is disabled.
    queueMicrotask(() => {

      if (!active.current) { setPhase('idle'); }

    });

  }, [disabled]);

  function clear() {

    setClip(null);
    onClipChange?.(null);

  }

  function finish(discard = false) {

    const recording = active.current;
    if (!recording) { return; }
    const { recorder, started } = recording;
    const elapsed = started === undefined ? 0 : performance.now() - started;
    if (discard || !recorder || elapsed < minDurationMs) {

      active.current = null;
      release(recording);
      setPhase('idle');
      if (!discard && recorder && elapsed < minDurationMs) { setError(copy.tooShortMessage); }
      return;

    }
    if (recorder.state === 'inactive') { return; }
    window.clearInterval(recording.interval);
    window.clearTimeout(recording.timeout);
    setPhase('finishing');
    recorder.onstop = () => {

      if (active.current !== recording) { return; }
      const blob = new Blob(recording.chunks, { type: recorder.mimeType || recording.chunks[0]?.type });
      const durationMs = Math.min(maxDurationMs, elapsed);
      const levels = recording.levels.slice();
      active.current = null;
      release(recording);
      setPhase('idle');
      if (!blob.size) {

        setError(copy.emptyMessage);
        return;

      }
      const next = { blob, durationMs, levels };
      setClip(next);
      onClipChange?.(next);

    };
    recorder.stop();

  }

  async function begin() {

    if (active.current || disabled || clip) { return; }
    setError(undefined);
    if (typeof MediaRecorder !== 'function' || !captureSource && !navigator.mediaDevices?.getUserMedia) {

      setError(copy.unsupportedMessage);
      return;

    }
    const recording: Recording = {
      controller: new AbortController(),
      levels: [],
      chunks: [],
    };
    active.current = recording;
    setMeter({ elapsed: 0, levels: [] });
    setPhase('requesting');

    try {

      if (typeof AudioContext === 'function') {

        try {

          recording.context = new AudioContext();
          void recording.context.resume().catch(() => undefined);

        } catch {
          // Audio visualization is optional when the browser can still record.
        }

      }
      const stream = captureSource
        ? await captureSource(recording.controller.signal)
        : await navigator.mediaDevices.getUserMedia({ audio: true });
      if (active.current !== recording) {

        stream.getTracks().forEach((track) => track.stop());
        return;

      }
      recording.stream = stream;
      const recorder = new MediaRecorder(stream);
      recording.recorder = recorder;
      let analyser: AnalyserNode | undefined;
      if (recording.context) {

        analyser = recording.context.createAnalyser();
        analyser.fftSize = 256;
        recording.context.createMediaStreamSource(stream).connect(analyser);

      }
      const sample = readLevel(analyser);
      recorder.ondataavailable = ({ data }) => {

        if (data.size) { recording.chunks.push(data); }

      };
      recorder.onerror = () => {

        if (active.current !== recording) { return; }
        finish(true);
        setError(copy.recordingMessage);

      };
      recorder.onstop = () => {

        if (active.current !== recording) { return; }
        finish(true);
        setError(copy.recordingMessage);

      };
      recorder.start(250);
      const started = performance.now();
      recording.started = started;
      setPhase('recording');
      recording.interval = window.setInterval(() => {

        recording.levels.push(sample());
        setMeter({ elapsed: performance.now() - started, levels: recording.levels.slice(-64) });

      }, sampleInterval);
      recording.timeout = window.setTimeout(finish, maxDurationMs);

    } catch (reason) {

      if (active.current !== recording) { return; }
      finish(true);
      const denied = reason instanceof DOMException && (
        reason.name === 'NotAllowedError' || reason.name === 'SecurityError'
      );
      setError(denied ? copy.permissionMessage : copy.recordingMessage);

    }

  }

  return { phase, error, clip, meter, begin, finish, clear };

}
