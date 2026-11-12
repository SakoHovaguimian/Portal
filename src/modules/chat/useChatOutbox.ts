'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useServiceContainer } from '@/providers/AppProviders';

import type { ChatDraft } from './models/chatDraft';
import { ConversationMessageSchema } from './models/conversationMessage';
import type { PendingChatMessage } from './models/pendingChatMessage';
import { readChatFiles } from './services/readChatFiles';

/** Local outbox overlays server reads, so polling and stale in-flight requests cannot erase a send. */
export function useChatOutbox(userId: string) {

  const { chatService } = useServiceContainer();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<PendingChatMessage[]>([]);
  const active = useRef(new Map<string, AbortController>());
  useEffect(() => {

    const requests = active.current;
    const cleanup = () => {

      for (const controller of requests.values()) { controller.abort(); }
      requests.clear();

    };

    return cleanup;

  }, [userId]);

  useEffect(() => {

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {

      const key = event.query.queryKey;
      if (event.type !== 'updated' || key[0] !== 'chat' || key[1] !== userId || key[2] !== 'messages' || event.query.state.status !== 'success') { return; }
      const parsed = ConversationMessageSchema.array().safeParse(event.query.state.data);
      if (!parsed.success) { return; }
      setItems((current) => {

        let changed = false;
        const updatedItems = current.map((item) => {

          if (item.authorId !== userId || item.status === 'sent') { return item; }
          const message = parsed.data.find((candidate) => candidate.authorId === userId && candidate.clientId === item.draft.clientId);
          if (!message) { return item; }
          changed = true;
          return { ...item, status: 'sent' as const, draft: { ...item.draft, files: [] }, message };

        });
        return changed ? updatedItems : current;

      });

    });

    return unsubscribe;

  }, [queryClient, userId]);

  function send(conversationId: string, draft: ChatDraft) {

    const clientId = draft.clientId || crypto.randomUUID();
    if (active.current.has(clientId)) {
      return;
    }
    const controller = new AbortController();
    active.current.set(clientId, controller);
    const snapshot: ChatDraft = {
      ...draft,
      clientId,
      files: [...draft.files],
    };
    setItems((current) => {

      const existing = current.find((item) => item.authorId === userId && item.draft.clientId === clientId);
      const updatedItems = existing ? current.map((item) => item === existing ? {
        ...item,
        status: 'sending' as const,
      } : item) : [...current, {
        conversationId,
        authorId: userId,
        draft: snapshot,
        createdAt: new Date().toISOString(),
        status: 'sending' as const,
        message: null,
      }];

      return updatedItems;

    });
    void (async () => {

      try {

        const attachments = await readChatFiles(snapshot.files);
        controller.signal.throwIfAborted();
        const message = await chatService.sendConversationMessage(conversationId, {
          body: snapshot.body,
          replyToId: snapshot.replyToId,
          attachments,
          clientId,
        }, controller.signal);
        setItems((current) => {

          const updatedItems = current.map((item) => item.authorId === userId && item.draft.clientId === clientId ? {
            ...item,
            draft: {
              ...item.draft,
              files: [],
            },
            status: 'sent' as const,
            message,
          } : item);

          return updatedItems;

        });
        void queryClient.invalidateQueries({ queryKey: ['chat'] });

      } catch {

        setItems((current) => {

          const updatedItems = current.map((item) => item.authorId === userId && item.draft.clientId === clientId && item.status !== 'sent' ? {
            ...item,
            status: 'failed' as const,
          } : item);

          return updatedItems;

        });

      } finally {
        active.current.delete(clientId);
      }

    })();

  }

  const pending = items.filter((item) => item.authorId === userId);
  return {
    items: pending,
    send,
  };

}
