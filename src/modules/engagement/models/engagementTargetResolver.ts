import type { EngagementTarget } from './engagementTarget';

export type EngagementTargetResolver = (
  id: string,
) => EngagementTarget | null | Promise<EngagementTarget | null>;
