import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { ChatMessageSchema } from '../models/chatMessage';
import { ChatMessageInputSchema } from '../models/chatMessageInput';

export class ChatService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - LIST CHAT MESSAGES
  // **************************************

  async listMessages(signal?: AbortSignal) {

    return ChatMessageSchema.array().parse(
      await this.api.request('/chat/messages', { signal }),
    );

  }

  // **************************************
  // MARK: - SEND CHAT MESSAGE
  // **************************************

  async sendMessage(message: string) {

    return ChatMessageSchema.parse(
      await this.api.request('/chat/messages', {
        method: 'POST',
        body: ChatMessageInputSchema.parse({ message }),
      }),
    );

  }

}
