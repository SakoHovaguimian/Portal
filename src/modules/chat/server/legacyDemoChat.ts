import 'server-only';

import { projectConfiguration } from '@/config/projectConfiguration';
import { getDemoState } from '@/services/demo/demoState';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import { strings } from '@/strings';

import { ChatMessageInputSchema, type ChatMessage } from '../models/chatMessage';

const owner = globalThis as typeof globalThis & {
  portalLegacyChatMessages?: ChatMessage[];
};

// **************************************
// MARK: - GET LEGACY DEMO CHAT MESSAGES
// **************************************

function getLegacyDemoChatMessages() {

  owner.portalLegacyChatMessages ??= projectConfiguration.starterData === 'empty' ? [] : [
    {
      id: '77777777-7777-4777-8777-777777777777',
      userId: getDemoState().users[0].id,
      author: strings.chat.author,
      message: strings.chat.seedHint,
      createdAt: new Date().toISOString(),
    },
  ];
  return owner.portalLegacyChatMessages;

}

// **************************************
// MARK: - RESET LEGACY DEMO CHAT
// **************************************

export function resetLegacyDemoChat() {
  owner.portalLegacyChatMessages = undefined;
}

// **************************************
// MARK: - REMOVE LEGACY DEMO ACCOUNT MESSAGES
// **************************************

export function resetLegacyDemoChatAccount(userId: string) {
  owner.portalLegacyChatMessages = getLegacyDemoChatMessages().filter((message) => message.userId !== userId);
}

// **************************************
// MARK: - HANDLE LEGACY DEMO CHAT REQUEST
// **************************************

export const handleLegacyDemoChat: DemoRequestHandler = async ({
  request,
  parts,
  current,
  input,
  json,
  empty,
}) => {

  if (parts[0] !== 'chat' || parts[1] !== 'messages') { return null; }
  const messages = getLegacyDemoChatMessages();
  if (request.method === 'GET') { return json(empty ? [] : messages.slice(-100)); }
  if (request.method !== 'POST') { return null; }
  const body = ChatMessageInputSchema.parse(await input());
  const message = {
    id: crypto.randomUUID(),
    userId: current.id,
    author: `${current.first_name} ${current.last_name}`,
    message: body.message,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return json(message, 201);

};
