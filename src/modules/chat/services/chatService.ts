import type { ApiClientInterface } from '@/services/api/apiClientInterface';

import { ChatConversationSchema, ChatConversationInputSchema, ChatConversationUpdateSchema, type ChatConversationInput, type ChatConversationUpdate } from '../models/chatConversation';
import { ChatMessageSchema } from '../models/chatMessage';
import { ChatMessageInputSchema } from '../models/chatMessageInput';
import { ChatPersonSchema } from '../models/chatPerson';
import type { ChatReactionEmoji } from '../models/chatReaction';
import { ConversationMessageSchema, ConversationMessageInputSchema, ConversationMessageUpdateSchema, type ConversationMessageInput } from '../models/conversationMessage';

export class ChatService {

  constructor(private readonly api: ApiClientInterface) { }

  // **************************************
  // MARK: - LIST CHAT MESSAGES
  // **************************************

  async listMessages(signal?: AbortSignal) {
    return ChatMessageSchema.array().parse(await this.api.request('/chat/messages', { signal }));
  }

  // **************************************
  // MARK: - SEND CHAT MESSAGE
  // **************************************

  async sendMessage(message: string) {

    return ChatMessageSchema.parse(await this.api.request('/chat/messages', {
      method: 'POST',
      body: ChatMessageInputSchema.parse({ message }),
    }));

  }

  // **************************************
  // MARK: - LIST CONVERSATIONS
  // **************************************

  async listConversations(signal?: AbortSignal) { return ChatConversationSchema.array().parse(await this.api.request('/chat/conversations', { signal })); }

  // **************************************
  // MARK: - LIST CHAT PEOPLE
  // **************************************

  async listPeople(signal?: AbortSignal) { return ChatPersonSchema.array().parse(await this.api.request('/chat/people', { signal })); }

  // **************************************
  // MARK: - CREATE CONVERSATION
  // **************************************

  async createConversation(input: ChatConversationInput) {

    return ChatConversationSchema.parse(await this.api.request('/chat/conversations', {
      method: 'POST',
      body: ChatConversationInputSchema.parse(input),
    }));

  }

  // **************************************
  // MARK: - UPDATE CONVERSATION
  // **************************************

  async updateConversation(id: string, input: ChatConversationUpdate) {

    return ChatConversationSchema.parse(await this.api.request(`/chat/conversations/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: ChatConversationUpdateSchema.parse(input),
    }));

  }

  // **************************************
  // MARK: - LIST CONVERSATION MESSAGES
  // **************************************

  async listConversationMessages(id: string, signal?: AbortSignal) { return ConversationMessageSchema.array().parse(await this.api.request(`/chat/conversations/${encodeURIComponent(id)}/messages`, { signal })); }

  // **************************************
  // MARK: - SEND CONVERSATION MESSAGE
  // **************************************

  async sendConversationMessage(id: string, input: ConversationMessageInput, signal?: AbortSignal) {

    return ConversationMessageSchema.parse(await this.api.request(`/chat/conversations/${encodeURIComponent(id)}/messages`, {
      method: 'POST',
      body: ConversationMessageInputSchema.parse(input),
      signal,
    }));

  }

  // **************************************
  // MARK: - EDIT CONVERSATION MESSAGE
  // **************************************

  async editMessage(id: string, body: string) {

    return ConversationMessageSchema.parse(await this.api.request(`/chat/messages/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: ConversationMessageUpdateSchema.parse({ body }),
    }));

  }

  // **************************************
  // MARK: - DELETE CONVERSATION MESSAGE
  // **************************************

  async deleteMessage(id: string) {

    return ConversationMessageSchema.parse(await this.api.request(`/chat/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      body: {},
    }));

  }

  // **************************************
  // MARK: - TOGGLE MESSAGE REACTION
  // **************************************

  async react(id: string, emoji: ChatReactionEmoji) {

    return ConversationMessageSchema.parse(await this.api.request(`/chat/messages/${encodeURIComponent(id)}/reactions`, {
      method: 'POST',
      body: { emoji },
    }));

  }

  // **************************************
  // MARK: - SET MESSAGE PIN
  // **************************************

  async setPinned(id: string, pinned: boolean) {

    return ConversationMessageSchema.parse(await this.api.request(`/chat/messages/${encodeURIComponent(id)}/pin`, {
      method: 'POST',
      body: { pinned },
    }));

  }

  // **************************************
  // MARK: - MARK CONVERSATION READ
  // **************************************

  async markRead(id: string) {

    return ChatConversationSchema.parse(await this.api.request(`/chat/conversations/${encodeURIComponent(id)}/read`, {
      method: 'POST',
      body: {},
    }));

  }

  // **************************************
  // MARK: - CHANGE CONVERSATION MEMBERSHIP
  // **************************************

  async changeMember(id: string, userId: string, method: 'POST' | 'PATCH' | 'DELETE', role?: 'admin' | 'member') {

    return ChatConversationSchema.parse(await this.api.request(`/chat/conversations/${encodeURIComponent(id)}/members`, {
      method,
      body: {
        userId,
        ...(role ? { role } : {}),
      },
    }));

  }

}
