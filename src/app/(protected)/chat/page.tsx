import type { Metadata } from 'next';

import { strings } from '@/strings';

import { ChatScreen } from '@/modules/chat/ChatScreen';

export const metadata: Metadata = { title: strings.chat.title };

export default function ChatPage() {
  return <ChatScreen />;
}
