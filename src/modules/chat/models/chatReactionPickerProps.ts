import type { ChatReactionEmoji } from './chatReaction';

export interface ChatReactionPickerProps {
  disabled: boolean;
  onReact: (emoji: ChatReactionEmoji) => void;
}
