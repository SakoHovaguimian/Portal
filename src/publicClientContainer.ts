import { BrowserApiClient } from '@/services/api/browserApiClient';
import { EngagementService } from '@/modules/engagement/services/engagementService';

// **************************************
// MARK: - CREATE PUBLIC ENGAGEMENT SERVICE
// **************************************

// Optional account actions never redirect anonymous public readers.
export function createPublicEngagementService() {

  return new EngagementService(
    new BrowserApiClient('/api/backend', { redirectOnUnauthorized: false }),
  );

}
