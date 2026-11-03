import type { ConversationMessage } from '../models/conversationMessage';
import type { ChatMessageAction } from '../models/chatMessageAction';

// **************************************
// MARK: - PROJECT OPTIMISTIC MESSAGE ACTION
// **************************************

export function projectChatMessage(message: ConversationMessage, action: ChatMessageAction, userId: string): ConversationMessage {

  if (action.kind === 'pin') { return { ...message, pinned: action.pinned }; }
  if (action.kind === 'edit') { return { ...message, body: action.body.trim(), editedAt: message.editedAt ?? message.createdAt }; }
  if (action.kind === 'delete') { return { ...message, body: '', attachments: [], reactions: [], pinned: false, deletedAt: message.deletedAt ?? message.createdAt }; }
  const reactions = message.reactions.map((reaction) => ({ ...reaction, userIds: [...reaction.userIds] }));
  const reaction = reactions.find((item) => item.emoji === action.emoji);
  if (!reaction) { reactions.push({ emoji: action.emoji, userIds: [userId] }); } else if (reaction.userIds.includes(userId)) { reaction.userIds = reaction.userIds.filter((id) => id !== userId); } else { reaction.userIds.push(userId); }
  const populated = reactions.filter((item) => item.userIds.length > 0);
  return { ...message, reactions: populated };

}
