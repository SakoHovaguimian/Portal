import type { ChatAttachment } from '../../models/chatAttachment';

export interface DemoChatFile { attachment: ChatAttachment; conversationId: string; messageId: string; data: Uint8Array }
