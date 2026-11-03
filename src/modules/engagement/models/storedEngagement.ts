import type { EngagementRecord } from './engagementRecord';
export interface StoredEngagement extends Omit<EngagementRecord, 'target'> {
  userId: string;
}
