import { UiIcon } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import type { ConversationMessage } from '../../models/conversationMessage';
import type { DetailsPinnedMessagesProps } from '../../models/detailsPinnedMessagesProps';

export function DetailsPinnedMessages({ messages, onMessageSelect }: DetailsPinnedMessagesProps) {

  function renderMessage(message: ConversationMessage) {

    return (
      <a
        key={message.id}
        href={`#message-${message.id}`}
        onClick={() => onMessageSelect?.(message.id)}
        className="group flex min-w-0 gap-3 rounded-control px-3 py-3 text-left no-underline hover:bg-secondary_subtle focus-visible:outline-2 focus-visible:outline-brand"
      >
        <UiIcon name="pin" className="mt-0.5 size-4 shrink-0 text-brand-secondary" />
        <span className="grid min-w-0 flex-1 gap-1">
          <span className="text-sm font-semibold text-primary wrap-anywhere">{message.author}</span>
          <span className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-secondary wrap-anywhere">{message.body || copy.attachments}</span>
        </span>
        <UiIcon name="chevronRight" className="mt-0.5 size-4 shrink-0 text-tertiary group-hover:text-brand-secondary" />
      </a>
    );

  }

  const rows = messages.map(renderMessage);
  return rows.length ? <div className="-mx-3 grid gap-1">{rows}</div> : <p className="m-0 text-sm leading-relaxed text-tertiary">{copy.noPinsHint}</p>;

}
