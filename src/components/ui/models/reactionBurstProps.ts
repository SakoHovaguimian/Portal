import type { ReactNode } from 'react';

import type { ReactionBurstFrames } from './reactionBurstFrames';

export interface ReactionBurstProps {
  active: boolean;
  ready?: boolean;
  frames: ReactionBurstFrames;
  children: ReactNode;
}
