import type { BlogCoverChoice } from './blogCoverChoice';

export interface BlogCoverFieldProps {
  value: string;
  covers: BlogCoverChoice[];
  disabled: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
  onUploadStateChange: (busy: boolean) => void;
}
