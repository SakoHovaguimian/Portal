import type { ReviewedDraftAssistantField, ReviewedDraftAssistantResult } from './reviewedDraftAssistant';

export interface ReviewedDraftAssistantProps {
  id: string;
  title: string;
  description: string;
  fields: ReviewedDraftAssistantField[];
  contextKey: string;
  disabled: boolean;
  generate: (
    transcript: string,
    signal: AbortSignal,
  ) => Promise<ReviewedDraftAssistantResult>;
  onApply: (suggestions: Record<string, string>) => void;
  onBusyChange: (busy: boolean) => boolean;
  questionsLabel: string;
  warningsLabel: string;
  rateLimited: string;
  transcriptPlaceholder?: string;
}
