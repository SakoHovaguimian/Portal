import 'server-only';
import { randomUUID } from 'node:crypto';

import { projectConfiguration } from '@/config/projectConfiguration';
import type { UserTransport } from '@/services/api/models/userTransport';
import { users as fixtureUsers } from '@/services/demo/demoFixtures';
import { getDemoState } from '@/services/demo/demoState';
import { portalChatStrings as copy } from '@/strings';

import type { ChatConversation } from '../models/chatConversation';
import type { ChatMember } from '../models/chatMember';
import type { ConversationMessage } from '../models/conversationMessage';
import type { DemoChatWorkspace } from './models/demoChatWorkspace';

const owner = globalThis as typeof globalThis & {
  portalChatWorkspace?: DemoChatWorkspace;
};

// **************************************
// MARK: - RESET DEMO CHAT STATE
// **************************************

export function resetDemoChatState() { delete owner.portalChatWorkspace; }

// **************************************
// MARK: - RESET DEMO CHAT ACCOUNT
// **************************************

export function resetDemoChatAccount(userId: string) {

  const state = owner.portalChatWorkspace;
  if (!state) {
    return;
  }
  for (const conversation of state.conversations) {

    conversation.members = conversation.members.filter((member) => member.id !== userId);
    if (conversation.members.length && !conversation.members.some((member) => member.role === 'owner')) {
      conversation.members[0].role = 'owner';
    }

  }
  const removed = new Set(state.conversations.filter((conversation) => !conversation.members.length).map((conversation) => conversation.id));
  state.conversations = state.conversations.filter((conversation) => !removed.has(conversation.id));
  for (const message of state.messages) {

    if (message.authorId === userId) {

      message.deletedAt = new Date().toISOString();
      message.body = '';
      message.attachments = [];
      message.reactions = [];
      message.pinned = false;

    }
    for (const reaction of message.reactions) {
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);
    }
    message.reactions = message.reactions.filter((reaction) => reaction.userIds.length);

  }
  state.messages = state.messages.filter((message) => !removed.has(message.conversationId));
  for (const [id, file] of state.files) {

    if (removed.has(file.conversationId) || state.messages.some((message) => message.id === file.messageId && message.deletedAt)) {
      state.files.delete(id);
    }

  }
  for (const key of state.preferences.keys()) {

    if (key.endsWith(`:${userId}`)) {
      state.preferences.delete(key);
    }

  }
  state.people = state.people.filter((person) => person.id !== userId);

}

// **************************************
// MARK: - GET DEMO CHAT WORKSPACE
// **************************************

export function getDemoChatWorkspace(actor: Pick<UserTransport, 'id' | 'first_name' | 'last_name' | 'email'>): DemoChatWorkspace {

  void actor.id;
  const accounts = getDemoState().users.filter((user) => !user.deleted && !user.disabled).map((user) => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    team: copy.member,
  }));
  const personas = copy.demo.people.map((person, index) => ({
    ...person,
    id: `60000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  }));
  const people = [...accounts, ...personas];
  if (owner.portalChatWorkspace) {

    owner.portalChatWorkspace.people = people;
    return owner.portalChatWorkspace;

  }
  const workspace: DemoChatWorkspace = {
    people,
    conversations: [],
    messages: [],
    files: new Map(),
    sent: new Map(),
    preferences: new Map(),
  };
  owner.portalChatWorkspace = workspace;
  const seedPeople = people.filter((person) => {

    const matches = fixtureUsers.some((user) => user.id === person.id);
    return matches;

  });
  if (projectConfiguration.starterData === 'empty' || seedPeople.length < 2) {
    return workspace;
  }
  // Only original fixture identities are seeded into shared conversations. Newly registered accounts need an invitation.
  seedPeople.push(...personas);
  const now = Date.now();
  const emptyDescription = '';
  const seeds = [
    {
      kind: 'group' as const,
      name: copy.demo.launchName,
      description: copy.demo.launchDescription,
      people: seedPeople.slice(0, 5),
      bodies: copy.demo.messages,
    },
    {
      kind: 'direct' as const,
      name: seedPeople[1].name,
      description: emptyDescription,
      people: seedPeople.slice(0, 2),
      bodies: copy.demo.directMessages,
    },
    {
      kind: 'group' as const,
      name: copy.demo.designName,
      description: copy.demo.designDescription,
      people: [seedPeople[0], seedPeople[1], seedPeople[3]],
      bodies: copy.demo.noteMessages,
    },
  ];
  for (const [index, seed] of seeds.entries()) {

    const id = randomUUID();
    const members: ChatMember[] = seed.people.map((person, position) => ({
      ...person,
      role: position === 0 ? 'owner' : 'member',
      lastReadAt: new Date(now - 20 * 60000).toISOString(),
    }));
    const messages: ConversationMessage[] = seed.bodies.map((body, position) => ({
      id: randomUUID(),
      conversationId: id,
      clientId: null,
      authorId: seed.people[(position + 1) % seed.people.length].id,
      author: seed.people[(position + 1) % seed.people.length].name,
      body,
      createdAt: new Date(now - ((seed.bodies.length - position) * 7 + index * 60) * 60000).toISOString(),
      editedAt: null,
      deletedAt: null,
      replyToId: null,
      attachments: [],
      pinned: position === 0 && index === 0,
      reactions: position === 1 ? [{
        emoji: copy.emoji.like,
        userIds: [seed.people[0].id, seed.people[1].id],
      }] : [],
    }));
    if (index === 0) {

      const message = messages[0];
      const bytes = new TextEncoder().encode(copy.demo.fileBody);
      const attachment = {
        id: randomUUID(),
        name: copy.demo.fileName,
        size: bytes.byteLength,
        mimeType: 'text/plain' as const,
      };
      message.attachments.push(attachment);
      workspace.files.set(attachment.id, {
        attachment,
        conversationId: id,
        messageId: message.id,
        data: bytes,
      });
      messages[4].replyToId = messages[3].id;

    }
    const conversation: ChatConversation = {
      id,
      kind: seed.kind,
      name: seed.name,
      description: seed.description,
      members,
      updatedAt: messages.at(-1)!.createdAt,
      lastMessage: messages.at(-1)!,
      unreadCount: index === 0 ? 2 : 0,
      muted: false,
      archived: false,
    };
    workspace.conversations.push(conversation);
    workspace.messages.push(...messages);

  }
  return workspace;

}
