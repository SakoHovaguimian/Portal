import { ChatScreen } from '@/modules/chat/ChatScreen';
import { strings } from '@/strings';
export const metadata = { title: strings.chat.title };
export default function ChatPage() {
  return <ChatScreen />;
}
