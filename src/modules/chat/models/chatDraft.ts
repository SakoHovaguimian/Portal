import type { UploadFile } from '@/components/ui';

export interface ChatDraft {
  body: string;
  files: UploadFile[];
  replyToId: string | null;
  clientId: string;
}
