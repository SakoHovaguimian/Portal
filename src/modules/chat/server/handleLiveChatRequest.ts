import 'server-only';
import { z } from 'zod';

import { NotFoundError } from '@/errors/domainErrors';
import type { BackendForward } from '@/services/api/models/backendForward';

import { ChatConversationInputSchema, ChatConversationUpdateSchema } from '../models/chatConversation';
import { ChatEmptyMutationInputSchema } from '../models/chatEmptyMutationInput';
import { ChatMemberUpdateSchema } from '../models/chatMemberUpdate';
import { ChatReactionInputSchema } from '../models/chatReaction';
import { ConversationMessageInputSchema, ConversationMessageUpdateSchema } from '../models/conversationMessage';
import { ConversationMessagePinInputSchema } from '../models/conversationMessagePinInput';
import { readChatInput } from './readChatInput';
import { validateChatAttachment } from './validateChatAttachment';

// **************************************
// MARK: - FORWARD LIVE CHAT REQUEST
// **************************************

/** Same typed camelCase contract on both sides. The backend MUST enforce membership, ownership, roles, and idempotency; this adapter never falls back to demo data. */
export async function handleLiveChatRequest(request: Request, path: string, forward: BackendForward): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const [area, resource, id, action, ...extra] = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (area !== 'chat') {
    return null;
  }
  if (resource === 'messages' && !id) {
    return null;
  }
  if (extra.length) {
    throw new NotFoundError();
  }
  if (id) {
    z.string().uuid().parse(id);
  }
  const method = request.method;
  let schema: z.ZodType | undefined;
  let read = false;
  if (resource === 'people' && !id && method === 'GET') {
    read = true;
  }
  if (resource === 'attachments' && id && !action && method === 'GET') {
    read = true;
  }
  if (resource === 'conversations') {

    if (method === 'GET' && (!action || (id && action === 'messages'))) {
      read = true;
    }
    if (!id && method === 'POST') {
      schema = ChatConversationInputSchema;
    }
    if (id && !action && method === 'PATCH') {
      schema = ChatConversationUpdateSchema;
    }
    if (id && action === 'messages' && method === 'POST') {
      schema = ConversationMessageInputSchema;
    }
    if (id && action === 'read' && method === 'POST') {
      schema = ChatEmptyMutationInputSchema;
    }
    if (id && action === 'members' && ['POST', 'PATCH', 'DELETE'].includes(method)) {
      schema = ChatMemberUpdateSchema;
    }

  }
  if (resource === 'messages' && id) {

    if (!action && method === 'PATCH') {
      schema = ConversationMessageUpdateSchema;
    }
    if (!action && method === 'DELETE') {
      schema = ChatEmptyMutationInputSchema;
    }
    if (action === 'pin' && method === 'POST') {
      schema = ConversationMessagePinInputSchema;
    }
    if (action === 'reactions' && method === 'POST') {
      schema = ChatReactionInputSchema;
    }

  }
  if (!read && !schema) {
    throw new NotFoundError();
  }
  if (read) {
    return forward(request, path);
  }
  const body = schema!.parse(await readChatInput(request));
  if (resource === 'conversations' && action === 'messages') {

    const message = ConversationMessageInputSchema.parse(body);
    for (const attachment of message.attachments) {
      validateChatAttachment(attachment);
    }

  }
  return forward(new Request(request.url, {
    method,
    signal: request.signal,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }), path);

}
