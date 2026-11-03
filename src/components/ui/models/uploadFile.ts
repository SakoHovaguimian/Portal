export interface UploadFile {
  id: string;
  name: string;
  size: number;
  file?: File;
  previewUrl?: string;
  status: 'ready' | 'uploading' | 'complete' | 'error' | 'cancelled';
  /** Omit when transferred bytes are unknown. */
  progress?: number;
  error?: string;
}
