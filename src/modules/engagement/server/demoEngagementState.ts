import 'server-only';

import type { StoredEngagement } from '../models/storedEngagement';

const demoGlobal = globalThis as typeof globalThis & {
  portalDemoEngagement?: StoredEngagement[];
};

// **************************************
// MARK: - GET DEMO ENGAGEMENT STATE
// **************************************

export function getDemoEngagementState() {
  return (demoGlobal.portalDemoEngagement ??= []);
}

// **************************************
// MARK: - RESET DEMO ENGAGEMENT STATE
// **************************************

export function resetDemoEngagementState() {
  demoGlobal.portalDemoEngagement = [];
}

// **************************************
// MARK: - RESET USER DEMO ENGAGEMENT
// **************************************

export function resetUserDemoEngagement(userId: string) {

  demoGlobal.portalDemoEngagement = getDemoEngagementState().filter(
    (record) => record.userId !== userId,
  );

}
