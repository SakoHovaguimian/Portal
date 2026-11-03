import type { BlogArticleDraft } from './blogArticle';
import type { BlogFormErrors } from './blogFormErrors';

export interface BlogArticleFieldsProps {
  form: BlogArticleDraft;
  errors: BlogFormErrors;
  disabled: boolean;
  onChangeAction: (form: BlogArticleDraft) => void;
  onUploadStateChangeAction: (busy: boolean) => void;
}
