import type { ConversationMessage } from './conversationMessage';
import type { PendingChatMessage } from './pendingChatMessage';

export interface ChatTimelineItem {
  id: string;
  createdAt: string;
  message: ConversationMessage | null;
  pending: PendingChatMessage | null;
}
