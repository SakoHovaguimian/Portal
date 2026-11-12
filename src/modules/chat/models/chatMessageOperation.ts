import type { ChatMessageAction } from './chatMessageAction';
import type { ConversationMessage } from './conversationMessage';

export interface ChatMessageOperation {
  action: ChatMessageAction;
  resolve: (message: ConversationMessage) => void;
  reject: (error: unknown) => void;
}
