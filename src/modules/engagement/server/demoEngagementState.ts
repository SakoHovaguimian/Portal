import 'server-only';
import type { StoredEngagement } from '../models/storedEngagement';
const demoGlobal = globalThis as typeof globalThis & {
  portalDemoEngagement?: StoredEngagement[];
};
export function getDemoEngagementState() {
  return (demoGlobal.portalDemoEngagement ??= []);
}
export function resetDemoEngagementState() {
  demoGlobal.portalDemoEngagement = [];
}
export function resetUserDemoEngagement(userId: string) {
  demoGlobal.portalDemoEngagement = getDemoEngagementState().filter(
    (record) => record.userId !== userId,
  );
}
