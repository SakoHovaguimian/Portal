import 'server-only';

import { portalModuleRegistry } from '@/config/portalModuleRegistry';
import { portalModules } from '@/config/portalModules';
import { NotFoundError } from '@/errors/domainErrors';

// **************************************
// MARK: - REQUIRE MODULE AVAILABILITY
// **************************************

export function requireModuleAvailability(path: string, currentUserId?: string) {

  const pathname = new URL(path, 'http://portal.internal').pathname;
  const disabled = portalModuleRegistry.some(
    ({ id, ownsApiPath }) => !portalModules[id] && ownsApiPath?.(pathname, currentUserId),
  );
  if (disabled) { throw new NotFoundError(); }

}
