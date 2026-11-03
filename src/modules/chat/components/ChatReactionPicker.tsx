'use client';
import { IconMenu } from '@/components/ui';
import { portalChatStrings as copy } from '@/strings';
import type { ChatReactionEmoji } from '../models/chatReaction';
import type { ChatReactionPickerProps } from '../models/chatReactionPickerProps';
import type { IconMenuItem } from '@/components/ui/models/iconMenuItem';

export function ChatReactionPicker({ disabled, onReact }: ChatReactionPickerProps) {

  const items: IconMenuItem<ChatReactionEmoji>[] = [
    {
      id: copy.emoji.like,
      label: copy.like,
      icon: 'check',
    },
    {
      id: copy.emoji.celebrate,
      label: copy.celebrate,
      icon: 'sparkles',
    },
    {
      id: copy.emoji.heart,
      label: copy.heart,
      icon: 'heart',
    },
  ];
  return <IconMenu label={copy.reactionPicker} icon="smile" items={items} disabled={disabled} onAction={onReact}/>;

}
