import type { BlogReadableImage } from './blogImage';

export interface BlogImageFieldsProps {
  image: BlogReadableImage;
  fieldId: string;
  disabled: boolean;
  errorKeys?: string[];
  errorId?: string;
  onChangeAction: (image: BlogReadableImage) => void;
  onUploadStateChangeAction: (busy: boolean) => void;
}
