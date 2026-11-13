import 'server-only';
import { randomUUID } from 'node:crypto';

import { NotFoundError, OwnershipError, ValidationError } from '@/errors/domainErrors';
import type { UserTransport } from '@/services/api/models/userTransport';
import { portalChatStrings as copy } from '@/strings';

import { ChatConversationInputSchema, ChatConversationUpdateSchema } from '../models/chatConversation';
import { ChatMemberUpdateSchema } from '../models/chatMemberUpdate';
import { ChatReactionInputSchema } from '../models/chatReaction';
import { ConversationMessageInputSchema, ConversationMessageUpdateSchema, type ConversationMessage } from '../models/conversationMessage';
import { ConversationMessagePinInputSchema } from '../models/conversationMessagePinInput';
import { getDemoChatWorkspace } from './demoChatState';
import { readChatInput } from './readChatInput';
import { validateChatAttachment } from './validateChatAttachment';

// **************************************
// MARK: - HANDLE DEMO CHAT REQUEST
// **************************************

export async function handleDemoChatRequest(request: Request, path: string, actor: Pick<UserTransport, 'id' | 'first_name' | 'last_name' | 'email'>, options: {
    empty?: boolean;
} = {}): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, resource, id, action, ...extra] = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (area !== 'chat') {
    return null;
  }
  // Preserve the original public compatibility endpoint, handled by the legacy chat adapter.
  if (resource === 'messages' && !id) {
    return null;
  }
  if (extra.length) {
    throw new NotFoundError();
  }
  const state = getDemoChatWorkspace(actor);
  const method = request.method;

  // **************************************
  // MARK: - CREATE DEMO CHAT RESPONSE
  // **************************************

  const json = (value: unknown, status = 200) => Response.json(value, {
    status,
    headers: { 'cache-control': 'no-store' },
  });

  // **************************************
  // MARK: - READ DEMO CHAT INPUT
  // **************************************

  const input = () => readChatInput(request);

  // **************************************
  // MARK: - AUTHORIZE CHAT CONVERSATION
  // **************************************

  const conversationFor = (conversationId: string) => {

    const conversation = state.conversations.find((item) => item.id === conversationId);
    if (!conversation) {
      throw new NotFoundError();
    }
    if (!conversation.members.some((member) => member.id === actor.id)) {
      throw new OwnershipError();
    }
    return conversation;

  };

  // **************************************
  // MARK: - AUTHORIZE CHAT GROUP MANAGEMENT
  // **************************************

  const manageable = (conversationId: string) => {

    const conversation = conversationFor(conversationId);
    const current = conversation.members.find((member) => member.id === actor.id)!;
    if (conversation.kind !== 'group' || !['owner', 'admin'].includes(current.role)) {
      throw new OwnershipError();
    }
    return conversation;

  };

  // **************************************
  // MARK: - REFRESH CHAT CONVERSATION PREVIEW
  // **************************************

  const refresh = (message: ConversationMessage) => {

    const conversation = conversationFor(message.conversationId);
    conversation.lastMessage = state.messages.filter((item) => item.conversationId === conversation.id).at(-1) ?? null;
    conversation.updatedAt = new Date().toISOString();

  };

  // **************************************
  // MARK: - PROJECT MEMBER CONVERSATION VIEW
  // **************************************

  const view = (conversation: typeof state.conversations[number]) => {

    const preferences = state.preferences.get(`${conversation.id}:${actor.id}`) ?? {
      muted: false,
      archived: false,
    };
    const member = conversation.members.find((item) => item.id === actor.id)!;
    const messages = state.messages.filter((message) => message.conversationId === conversation.id);
    const unreadCount = messages.filter((message) => message.authorId !== actor.id && !message.deletedAt && (!member.lastReadAt || message.createdAt > member.lastReadAt)).length;
    const name = conversation.kind === 'direct' ? conversation.members.find((item) => item.id !== actor.id)?.name ?? conversation.name : conversation.name;
    return {
      ...conversation,
      ...preferences,
      name,
      unreadCount,
      lastMessage: messages.at(-1) ?? null,
    };

  };
  if (resource === 'people' && !id && method === 'GET') {

    const peopleResponse = json(options.empty ? [] : state.people.filter((person) => person.id !== actor.id));
    return peopleResponse;

  }
  if (resource === 'attachments' && id && !action && method === 'GET') {

    const file = state.files.get(id);
    if (!file) {
      throw new NotFoundError();
    }
    conversationFor(file.conversationId);
    const message = state.messages.find((item) => item.id === file.messageId);
    if (!message || message.deletedAt) {
      throw new NotFoundError();
    }
    return new Response(new Uint8Array(file.data), { headers: {
      'content-type': file.attachment.mimeType,
      'content-disposition': `${url.searchParams.has('download') || !file.attachment.mimeType.startsWith('image/') ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.attachment.name)}`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; sandbox",
    } });

  }
  if (resource === 'conversations' && !id) {

    if (method === 'GET') {

      const conversations = state.conversations.filter((item) => {

        const matches = item.members.some((member) => member.id === actor.id);
        return matches;

      });
      const conversationsResponse = json(options.empty ? [] : conversations.toSorted((firstConversation, secondConversation) => secondConversation.updatedAt.localeCompare(firstConversation.updatedAt)).map(view));
      return conversationsResponse;

    }
    if (method === 'POST') {

      const value = ChatConversationInputSchema.parse(await input());
      const ids = [...new Set(value.memberIds)];
      if (ids.includes(actor.id) || ids.length !== value.memberIds.length) {
        throw new ValidationError(copy.validation.people);
      }
      const members = ids.map((memberId) => {

        const person = state.people.find((item) => item.id === memberId);
        if (!person) {
          throw new ValidationError(copy.validation.people);
        }
        return {
          ...person,
          role: 'member' as const,
          lastReadAt: null,
        };

      });
      if (value.kind === 'direct') {

        const existing = state.conversations.find((item) => {

          const matches = item.kind === 'direct' && item.members.some((member) => member.id === ids[0]) && item.members.some((member) => member.id === actor.id);
          return matches;

        });
        if (existing) {

          const preferences = state.preferences.get(`${existing.id}:${actor.id}`) ?? {
            muted: false,
            archived: false,
          };
          state.preferences.set(`${existing.id}:${actor.id}`, {
            ...preferences,
            archived: false,
          });
          return json(view(existing));

        }

      }
      const current = state.people.find((person) => person.id === actor.id)!;
      const conversation = {
        id: randomUUID(),
        kind: value.kind,
        name: value.kind === 'direct' ? members[0].name : value.name,
        description: value.description,
        members: [{
          ...current,
          role: 'owner' as const,
          lastReadAt: new Date().toISOString(),
        }, ...members],
        updatedAt: new Date().toISOString(),
        lastMessage: null,
        unreadCount: 0,
        muted: false,
        archived: false,
      };
      state.conversations.push(conversation);
      return json(view(conversation), 201);

    }

  }
  if (resource === 'conversations' && id) {

    const conversation = conversationFor(id);
    if (!action && method === 'GET') {
      return json(view(conversation));
    }
    if (!action && method === 'PATCH') {

      const value = ChatConversationUpdateSchema.parse(await input());
      if (value.name !== undefined || value.description !== undefined) {
        manageable(id);
      }
      const { muted, archived, ...details } = value;
      Object.assign(conversation, details);
      const preferences = state.preferences.get(`${id}:${actor.id}`) ?? {
        muted: false,
        archived: false,
      };
      state.preferences.set(`${id}:${actor.id}`, {
        muted: muted ?? preferences.muted,
        archived: archived ?? preferences.archived,
      });
      return json(view(conversation));

    }
    if (action === 'read' && method === 'POST') {

      conversation.members.find((member) => member.id === actor.id)!.lastReadAt = new Date().toISOString();
      conversation.unreadCount = 0;
      return json(view(conversation));

    }
    if (action === 'members') {

      manageable(id);
      const value = ChatMemberUpdateSchema.parse(await input());
      const current = conversation.members.find((member) => member.id === actor.id)!;
      const member = conversation.members.find((item) => item.id === value.userId);
      if (method === 'POST') {

        if (member || conversation.members.length >= 20 || value.role) {
          throw new ValidationError(copy.validation.people);
        }
        const person = state.people.find((item) => item.id === value.userId);
        if (!person) {
          throw new NotFoundError();
        }
        conversation.members.push({
          ...person,
          role: 'member',
          lastReadAt: null,
        });

      } else if (method === 'PATCH' || method === 'DELETE') {

        if (!member) {
          throw new NotFoundError();
        }
        if (member.role === 'owner' || member.id === actor.id || (current.role !== 'owner' && (member.role === 'admin' || method === 'PATCH'))) {
          throw new OwnershipError();
        }
        if (method === 'DELETE') {
          conversation.members = conversation.members.filter((item) => item.id !== value.userId);
        } else {

          if (!value.role) {
            throw new ValidationError();
          }
          member.role = value.role;

        }

      } else {
        throw new NotFoundError();
      }
      return json(view(conversation));

    }
    if (action === 'messages') {

      if (method === 'GET') {

        const messages = state.messages.filter((message) => message.conversationId === id);
        return json(options.empty ? [] : messages);

      }
      if (method === 'POST') {

        const value = ConversationMessageInputSchema.parse(await input());
        const sentId = state.sent.get(`${id}:${actor.id}:${value.clientId}`);
        if (sentId) {

          const sentMessageResponse = json(state.messages.find((message) => message.id === sentId));
          return sentMessageResponse;

        }
        if (value.replyToId && !state.messages.some((message) => message.id === value.replyToId && message.conversationId === id && !message.deletedAt)) {
          throw new ValidationError();
        }
        const validated = value.attachments.map((file) => ({
          file,
          bytes: validateChatAttachment(file),
        }));
        const messageId = randomUUID();
        const attachments = validated.map(({ file, bytes }) => {

          const attachment = {
            id: randomUUID(),
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
          };
          state.files.set(attachment.id, {
            attachment,
            conversationId: id,
            messageId,
            data: bytes,
          });
          return attachment;

        });
        const message: ConversationMessage = {
          id: messageId,
          conversationId: id,
          clientId: value.clientId,
          authorId: actor.id,
          author: state.people.find((person) => person.id === actor.id)!.name,
          body: value.body,
          createdAt: new Date().toISOString(),
          editedAt: null,
          deletedAt: null,
          replyToId: value.replyToId,
          attachments,
          pinned: false,
          reactions: [],
        };
        state.messages.push(message);
        state.sent.set(`${id}:${actor.id}:${value.clientId}`, message.id);
        const preferences = state.preferences.get(`${id}:${actor.id}`) ?? {
          muted: false,
          archived: false,
        };
        state.preferences.set(`${id}:${actor.id}`, {
          ...preferences,
          archived: false,
        });
        conversation.members.find((member) => member.id === actor.id)!.lastReadAt = message.createdAt;
        refresh(message);
        return json(message, 201);

      }

    }

  }
  if (resource === 'messages' && id) {

    const message = state.messages.find((item) => item.id === id);
    if (!message) {
      throw new NotFoundError();
    }
    conversationFor(message.conversationId);
    if (message.deletedAt) {
      throw new NotFoundError();
    }
    if (action === 'reactions' && method === 'POST') {

      const { emoji } = ChatReactionInputSchema.parse(await input());
      const reaction = message.reactions.find((item) => item.emoji === emoji);
      if (!reaction) {

        message.reactions.push({
          emoji,
          userIds: [actor.id],
        });

      } else if (reaction.userIds.includes(actor.id)) {
        reaction.userIds = reaction.userIds.filter((userId) => userId !== actor.id);
      } else {
        reaction.userIds.push(actor.id);
      }
      message.reactions = message.reactions.filter((item) => item.userIds.length > 0);
      return json(message);

    }
    if (action === 'pin' && method === 'POST') {

      const { pinned } = ConversationMessagePinInputSchema.parse(await input());
      message.pinned = pinned;
      return json(message);

    }
    if (!action && (method === 'PATCH' || method === 'DELETE')) {

      if (message.authorId !== actor.id) {
        throw new OwnershipError();
      }
      if (method === 'PATCH') {

        message.body = ConversationMessageUpdateSchema.parse(await input()).body;
        message.editedAt = new Date().toISOString();

      } else {

        message.deletedAt = new Date().toISOString();
        message.body = '';
        message.pinned = false;
        message.reactions = [];
        for (const file of message.attachments) {
          state.files.delete(file.id);
        }
        message.attachments = [];

      }
      refresh(message);
      return json(message);

    }

  }
  throw new NotFoundError();

}
