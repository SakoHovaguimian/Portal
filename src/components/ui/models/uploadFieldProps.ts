import type { FileListProps } from './fileListProps';
import type { FileRejection } from './fileRejection';

export interface UploadFieldProps extends FileListProps {
  label: string;
  description?: string;
  accept?: string;
  acceptedTypesLabel?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  required?: boolean;
  invalid?: boolean;
  onFiles: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
}
