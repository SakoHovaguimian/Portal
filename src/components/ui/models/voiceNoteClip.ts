export interface VoiceNoteClip {
  blob: Blob;
  durationMs: number;
  levels: readonly number[];
}
