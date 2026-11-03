import type { ChatConversation } from './chatConversation';
import type { ChatPerson } from './chatPerson';
import type { ConversationMessage } from './conversationMessage';

export interface ConversationDetailsProps {
  conversation: ChatConversation;
  messages: ConversationMessage[];
  people: ChatPerson[];
  userId: string;
  variant?: 'sidebar' | 'dialog';
  onChanged: () => void;
  onMessageSelect?: (messageId: string) => void;
}
