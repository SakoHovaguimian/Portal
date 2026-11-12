import type { ChatConversation } from '../../models/chatConversation';
import type { ChatMemberPreference } from '../../models/chatMemberPreference';
import type { ChatPerson } from '../../models/chatPerson';
import type { ConversationMessage } from '../../models/conversationMessage';
import type { DemoChatFile } from './demoChatFile';

export interface DemoChatWorkspace {
    people: ChatPerson[];
    conversations: ChatConversation[];
    messages: ConversationMessage[];
    files: Map<string, DemoChatFile>;
    sent: Map<string, string>;
    preferences: Map<string, ChatMemberPreference>;
}
