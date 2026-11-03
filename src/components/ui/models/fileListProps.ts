import type { UploadFile } from './uploadFile';

export interface FileListProps {
  files: readonly UploadFile[];
  label?: string;
  disabled?: boolean;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}
