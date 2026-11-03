import type { ChatDraft } from './chatDraft';
import type { ConversationMessage } from './conversationMessage';

export interface ChatComposerProps {
  draft: ChatDraft;
  reply?: ConversationMessage;
  onDraft: (draft: ChatDraft) => void;
  onSend: (draft: ChatDraft) => void;
}
