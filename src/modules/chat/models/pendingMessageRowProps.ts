import type { ConversationMessage } from './conversationMessage';
import type { PendingChatMessage } from './pendingChatMessage';

export interface PendingMessageRowProps {
  item: PendingChatMessage;
  author: string;
  reply?: ConversationMessage;
  onRetry: () => void;
}
