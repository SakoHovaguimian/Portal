import type { VoiceNoteCaptureSource } from '@/components/ui';

export const captureSampleVoiceNote: VoiceNoteCaptureSource = async (signal) => {

  const context = new AudioContext();

  try {

    const [response] = await Promise.all([
      fetch('/component-library/voice-note.wav', { signal }),
      context.resume(),
    ]);
    if (!response.ok) { throw new Error('sample-audio-unavailable'); }
    const audio = await context.decodeAudioData(await response.arrayBuffer());
    signal.throwIfAborted();
    const stream = context.createMediaStreamDestination();
    const source = context.createBufferSource();
    source.buffer = audio;
    source.loop = true;
    source.connect(stream);
    signal.addEventListener('abort', () => {

      source.stop();
      void context.close().catch(() => undefined);

    }, { once: true });
    source.start();
    return stream.stream;

  } catch (error) {

    void context.close().catch(() => undefined);
    throw error;

  }

};
