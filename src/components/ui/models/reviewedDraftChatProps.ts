import type { ReviewedDraftAssistantField, ReviewedDraftAssistantResult } from './reviewedDraftAssistant';

export interface ReviewedDraftChatProps {
  open: boolean;
  fields: ReviewedDraftAssistantField[];
  contextKey: string;
  disabled: boolean;
  generate: (
    transcript: string,
    signal: AbortSignal,
  ) => Promise<ReviewedDraftAssistantResult>;
  onApply: (suggestions: Record<string, string>) => void;
  onBusyChange: (busy: boolean) => boolean;
  onClose: () => void;
  onReturnFocus: () => void;
}
