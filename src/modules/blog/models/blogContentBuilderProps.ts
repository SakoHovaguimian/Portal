import type { StoredBlogContent } from './storedBlogContent';

export interface BlogContentBuilderProps {
  content: StoredBlogContent[];
  disabled: boolean;
  showErrors: boolean;
  onChangeAction: (content: StoredBlogContent[]) => void;
  onUploadStateChangeAction: (busy: boolean) => void;
}
