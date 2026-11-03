'use client';
import { useQuery } from '@tanstack/react-query';
import { useServiceContainer, useSessionState } from '@/providers/AppProviders';
import { useRealtime } from '@/services/realtime/RealtimeProvider';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';

export function useChatWorkspace() {

  const { chatService } = useServiceContainer();
  const { session } = useSessionState();
  const realtime = useRealtime();
  const { demoMode } = useRuntimeConfig();
  const userId = session?.user.id ?? '';
  const interval = demoMode || realtime.status === 'offline' ? 5000 : 15000;
  const conversations = useQuery({
    queryKey: ['chat', userId, 'conversations'],
    queryFn: ({ signal }) => chatService.listConversations(signal),
    refetchInterval: interval,
  });
  const people = useQuery({
    queryKey: ['chat', userId, 'people'],
    queryFn: ({ signal }) => chatService.listPeople(signal),
  });
  return {
    chatService,
    userId,
    conversations,
    people,
    demoMode,
  };

}

export function useConversationMessages(conversationId: string | null) {

  const { chatService } = useServiceContainer();
  const { session } = useSessionState();
  const userId = session?.user.id ?? '';
  const messages = useQuery({
    queryKey: ['chat', userId, 'messages', conversationId],
    queryFn: ({ signal }) => chatService.listConversationMessages(conversationId!, signal),
    enabled: Boolean(conversationId),
    refetchInterval: 5000,
  });

  return messages;

}
