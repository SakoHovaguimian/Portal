import type { ChatReactionEmoji } from './chatReaction';

export type ChatMessageAction =
  | { kind: 'reaction'; emoji: ChatReactionEmoji }
  | { kind: 'pin'; pinned: boolean }
  | { kind: 'edit'; body: string }
  | { kind: 'delete' };
