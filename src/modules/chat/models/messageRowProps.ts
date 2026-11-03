import type { ChatReactionEmoji } from './chatReaction';
import type { ConversationMessage } from './conversationMessage';

export interface MessageRowProps {
  message: ConversationMessage;
  reply?: ConversationMessage;
  own: boolean;
  read: boolean;
  userId: string;
  busy: boolean;
  failed: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onReact: (emoji: ChatReactionEmoji) => void;
}
