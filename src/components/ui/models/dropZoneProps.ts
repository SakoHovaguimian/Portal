import type { ReactNode } from 'react';

export interface DropZoneProps {
  children: ReactNode;
  disabled?: boolean;
  onFiles: (files: FileList) => void;
}
