import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { projectConfiguration } from '@/config/projectConfiguration';
import { strings } from '@/strings';

import { featureRequests } from './demoFixtures';
import { createDemoUsers } from './demoPresets';
import {
  registerDemoReset,
  registerDemoAccountReset,
} from './demoResetRegistry';
import type { DemoPasswordRecord } from './models/demoPasswordRecord';
import type { DemoState } from './models/demoState';

// **************************************
// MARK: - CREATE DEMO PASSWORD RECORD
// **************************************

export function passwordRecord(password: string): DemoPasswordRecord {

  const salt = randomBytes(16).toString('hex');
  return { salt, hash: scryptSync(password, salt, 32).toString('hex') };

}

// **************************************
// MARK: - VERIFY DEMO PASSWORD
// **************************************

export function passwordMatches(
  password: string,
  record: DemoPasswordRecord,
) {

  return timingSafeEqual(
    Buffer.from(record.hash, 'hex'),
    scryptSync(password, record.salt, 32),
  );

}
const globalDemo = globalThis as typeof globalThis & {
  portalDemoState?: DemoState;
};

// **************************************
// MARK: - GET DEMO STATE
// **************************************

export function getDemoState(): DemoState {

  if (!globalDemo.portalDemoState) {

    const users = createDemoUsers();
    globalDemo.portalDemoState = {
      generation: crypto.randomUUID(),
      users,
      featureRequests: projectConfiguration.starterData === 'empty' ? [] : structuredClone(featureRequests),
      credentials: new Map(
        users.map((user) => [
          user.external_id,
          passwordRecord(strings.ui.demoState.password123),
        ]),
      ),
      refreshTokens: new Map(),
      messages: projectConfiguration.starterData === 'empty' ? [] : [
        {
          id: '77777777-7777-4777-8777-777777777777',
          userId: users[0].id,
          author: strings.chat.author,
          message: strings.chat.seed,
          createdAt: new Date().toISOString(),
        },
      ],
    };

  }
  return globalDemo.portalDemoState;

}

// **************************************
// MARK: - RESET DEMO STATE
// **************************************

export function resetDemoState() {

  globalDemo.portalDemoState = undefined;
  getDemoState();

}
registerDemoReset('core', resetDemoState);

registerDemoAccountReset('core', (userId) => {

  const state = getDemoState();
  state.featureRequests = state.featureRequests.filter(
    (item) => item.user_id !== userId,
  );
  state.messages = state.messages.filter((item) => item.userId !== userId);

});
