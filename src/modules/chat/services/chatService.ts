import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import {
  ChatMessageSchema,
  ChatMessageInputSchema,
} from '../models/chatMessage';
export class ChatService {
  constructor(private readonly api: ApiClientInterface) {}
  async listMessages() {
    return ChatMessageSchema.array().parse(
      await this.api.request('/chat/messages'),
    );
  }
  async sendMessage(message: string) {
    return ChatMessageSchema.parse(
      await this.api.request('/chat/messages', {
        method: 'POST',
        body: ChatMessageInputSchema.parse({ message }),
      }),
    );
  }
}
