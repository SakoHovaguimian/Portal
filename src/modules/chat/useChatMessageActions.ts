'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useServiceContainer } from '@/providers/AppProviders';

import type { ChatConversation } from './models/chatConversation';
import type { ChatMessageAction } from './models/chatMessageAction';
import type { ChatMessageActions } from './models/chatMessageActions';
import type { ChatMessageQueue } from './models/chatMessageQueue';
import type { ChatReactionEmoji } from './models/chatReaction';
import type { ConversationMessage } from './models/conversationMessage';
import { projectChatMessage } from './services/projectChatMessage';

/** Message-local queues preserve rapid intent order; pending projections shield polling without delaying input. */
export function useChatMessageActions(userId: string): ChatMessageActions {

  const { chatService } = useServiceContainer();
  const queryClient = useQueryClient();
  const queues = useRef(new Map<string, ChatMessageQueue>());
  const mounted = useRef(true);
  const [projections, setProjections] = useState<Record<string, ConversationMessage>>({});
  const [failedIds, setFailedIds] = useState<string[]>([]);

  function write(message: ConversationMessage) {

    const key = ['chat', userId, 'messages', message.conversationId];
    // Logout and demo account switching clear private queries. Never recreate an old account's cache afterward.
    if (!queryClient.getQueryState(key)) { return; }

    void queryClient.cancelQueries({ queryKey: key, exact: true }, { revert: false });
    queryClient.setQueryData<ConversationMessage[]>(key, (current) => {

      const updatedMessages = current?.some((item) => item.id === message.id) ? current.map((item) => item.id === message.id ? message : item) : [...(current ?? []), message];
      return updatedMessages;

    });
    queryClient.setQueryData<ChatConversation[]>(['chat', userId, 'conversations'], (current) => {

      const updatedConversations = current?.map((conversation) => conversation.lastMessage?.id === message.id ? { ...conversation, lastMessage: message } : conversation);
      return updatedConversations;

    });

  }

  function project(queue: ChatMessageQueue) {

    const message = queue.operations.reduce((current, operation) => projectChatMessage(current, operation.action, userId), queue.base);
    return message;

  }

  function publish(messageId: string, queue: ChatMessageQueue) {

    const message = project(queue);
    write(message);
    if (mounted.current) {

      setProjections((current) => {

        const nextProjections = { ...current };
        if (queue.operations.length) { nextProjections[messageId] = message; } else { delete nextProjections[messageId]; }
        return nextProjections;

      });

    }

  }

  async function drain(messageId: string, queue: ChatMessageQueue) {

    if (queue.active) { return; }
    queue.active = true;
    while (queue.operations.length && mounted.current) {

      const operation = queue.operations[0];
      try {

        let response: ConversationMessage;
        const action = operation.action;
        if (action.kind === 'reaction') { response = await chatService.react(messageId, action.emoji); } else if (action.kind === 'pin') { response = await chatService.setPinned(messageId, action.pinned); } else if (action.kind === 'edit') { response = await chatService.editMessage(messageId, action.body); } else { response = await chatService.deleteMessage(messageId); }
        queue.base = response;
        queue.operations.shift();
        publish(messageId, queue);
        operation.resolve(response);

      } catch (error) {

        queue.operations.shift();
        if (mounted.current) {

          setFailedIds((current) => {

            const nextFailedIds = current.includes(messageId) ? current : [...current, messageId];
            return nextFailedIds;

          });

        }
        publish(messageId, queue);
        // A failed transport may have committed. Recover authoritative state before the next queued toggle.
        try {

          const history = await chatService.listConversationMessages(queue.base.conversationId);
          const recovered = history.find((message) => message.id === messageId);
          if (recovered) { queue.base = recovered; }

        } catch { /* The previous acknowledged value remains the rollback baseline. */ }
        publish(messageId, queue);
        operation.reject(error);

      }

    }
    queue.active = false;
    if (!queue.operations.length && queues.current.get(messageId) === queue) { queues.current.delete(messageId); }

  }

  function enqueue(message: ConversationMessage, action: ChatMessageAction) {

    const queue = queues.current.get(message.id) ?? { base: message, operations: [], active: false };
    queues.current.set(message.id, queue);
    setFailedIds((current) => {

      const remainingFailedIds = current.filter((id) => id !== message.id);
      return remainingFailedIds;

    });
    const completion = new Promise<ConversationMessage>((resolve, reject) => {
      queue.operations.push({ action, resolve, reject });
    });
    publish(message.id, queue);
    void drain(message.id, queue);
    return completion;

  }

  useEffect(() => {

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {

      const eventKey = event.query.queryKey;
      if (event.type !== 'updated' || eventKey[0] !== 'chat' || eventKey[1] !== userId || eventKey[2] !== 'messages' || !queues.current.size) { return; }
      const current = event.query.state.data as ConversationMessage[] | undefined;
      if (!Array.isArray(current)) { return; }
      let changed = false;
      const projected = new Map<string, ConversationMessage>();
      for (const [id, queue] of queues.current) {

        if (queue.base.conversationId !== eventKey[3]) { continue; }

        const value = queue.operations.reduce((message, operation) => projectChatMessage(message, operation.action, userId), queue.base);
        const existing = current.find((message) => message.id === id);
        if (JSON.stringify(existing) !== JSON.stringify(value)) {

          changed = true;
          projected.set(id, value);

        }

      }
      if (!changed) { return; }
      const projectedMessages = current.map((message) => projected.get(message.id) ?? message);
      for (const [id, message] of projected) {

        if (!current.some((item) => item.id === id)) { projectedMessages.push(message); }

      }
      queryClient.setQueryData(eventKey, projectedMessages);

    });

    return unsubscribe;

  }, [queryClient, userId]);

  useEffect(() => {

    mounted.current = true;
    const pendingQueues = queues.current;
    const cleanup = () => {

      mounted.current = false;
      for (const queue of pendingQueues.values()) {

        // Only requests already dispatched may finish; queued actions never execute under a later account.
        const queued = queue.active ? queue.operations.splice(1) : queue.operations.splice(0);
        for (const operation of queued) { operation.reject(new DOMException('', 'AbortError')); }

      }
      pendingQueues.clear();

    };

    return cleanup;

  }, [userId]);

  function react(message: ConversationMessage, emoji: ChatReactionEmoji) { void enqueue(message, { kind: 'reaction', emoji }).catch(() => {}); }

  function pin(message: ConversationMessage, pinned: boolean) { void enqueue(message, { kind: 'pin', pinned }).catch(() => {}); }

  function edit(message: ConversationMessage, body: string) { return enqueue(message, { kind: 'edit', body }); }

  function remove(message: ConversationMessage) { return enqueue(message, { kind: 'delete' }); }

  const busyIds = Object.keys(projections);
  return { projections, failedIds, busyIds, react, pin, edit, remove };

}
