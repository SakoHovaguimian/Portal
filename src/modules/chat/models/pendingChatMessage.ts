import type { ChatDraft } from './chatDraft';
import type { ConversationMessage } from './conversationMessage';

export interface PendingChatMessage {
  conversationId: string;
  authorId: string;
  draft: ChatDraft;
  createdAt: string;
  status: 'sending' | 'failed' | 'sent';
  message: ConversationMessage | null;
}
