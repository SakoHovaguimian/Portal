import type { VoiceNoteCaptureSource } from './voiceNoteCaptureSource';
import type { VoiceNoteClip } from './voiceNoteClip';

export interface VoiceNoteProps {
  label?: string;
  onClipChange?: (clip: VoiceNoteClip | null) => void;
  captureSource?: VoiceNoteCaptureSource;
  interaction?: 'hold' | 'toggle';
  minDurationMs?: number;
  maxDurationMs?: number;
  cancelDistance?: number;
  bars?: number;
  sensitivity?: number;
  bounce?: number;
  disabled?: boolean;
  className?: string;
}
