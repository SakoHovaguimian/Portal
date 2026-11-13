import 'server-only';

import { getProjectRouting } from '@/config/getProjectRouting';
import { enabledPortalModules } from '@/config/portalModuleRegistry';
import {
  registerDemoReset,
  registerDemoAccountReset,
} from '@/services/demo/demoResetRegistry';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';

// **************************************
// MARK: - COMPOSE DEMO MODULE HANDLERS
// **************************************

export function createDemoModuleHandlers(): DemoRequestHandler[] {

  const handlers: DemoRequestHandler[] = [];
  const routing = getProjectRouting();
  for (const { id, demo } of enabledPortalModules) {

    if (!demo) { continue; }
    if (demo.reset) { registerDemoReset(id, demo.reset); }
    const { resetAccount } = demo;
    if (resetAccount) { registerDemoAccountReset(id, (userId) => resetAccount(userId, routing)); }
    handlers.push(demo.handle);

  }
  return handlers;

}
