import type { BlogReadableContent } from './blogReadableContent';

export interface BlogBlockFieldsProps {
  block: BlogReadableContent;
  disabled: boolean;
  errorPaths?: string[];
  onChangeAction: (block: BlogReadableContent) => void;
  onUploadStateChangeAction: (busy: boolean) => void;
}
