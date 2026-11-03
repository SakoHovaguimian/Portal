import type { useReviewedDraftAssistant } from '../useReviewedDraftAssistant';
import type { ReviewedDraftAssistantField } from './reviewedDraftAssistant';

export type DraftChatReviewProps = Pick<
  ReturnType<typeof useReviewedDraftAssistant>,
  | 'resultRef'
  | 'review'
  | 'selected'
  | 'setReview'
  | 'setSelected'
  | 'result'
  | 'stale'
  | 'canApply'
  | 'apply'
> & {
  fields: ReviewedDraftAssistantField[];
  blocked: boolean;
  onDecline: () => void;
};
