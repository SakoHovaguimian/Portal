import type { ConversationMessage } from './conversationMessage';

export interface DetailsPinnedMessagesProps {
  messages: ConversationMessage[];
  onMessageSelect?: (messageId: string) => void;
}
