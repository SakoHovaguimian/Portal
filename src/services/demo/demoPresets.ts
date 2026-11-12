import 'server-only';
import { portalDemoStrings as copy } from '@/strings';

import { users } from './demoFixtures';
import type { DemoPreset } from './models/demoPreset';
import type { DemoUser } from './models/demoUser';

export const demoPresetIds: Record<DemoPreset, string> = {
  populated: users[0].id,
  empty: '88888888-8888-4888-8888-888888888888',
  onboarding: '99999999-9999-4999-8999-999999999999',
  admin: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  superadmin: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
};

// **************************************
// MARK: - FIND DEMO ACCOUNT PRESET
// **************************************

export function demoPresetForUser(id: string): DemoPreset | undefined {

  const preset = (Object.keys(demoPresetIds) as DemoPreset[]).find(
    (key) => demoPresetIds[key] === id,
  );

  return preset;

}

// **************************************
// MARK: - CREATE PRESET DEMO USERS
// **************************************

export function createDemoUsers(): DemoUser[] {

  const result: DemoUser[] = structuredClone(users).map((user) => ({
    ...user,
    role: 'user',
    disabled: false,
  }));
  for (const key of ['empty', 'onboarding', 'admin', 'superadmin'] as const) {

    const account = copy.accounts[key];
    const now = new Date().toISOString();
    result.push({
      id: demoPresetIds[key],
      external_id: `portal-demo-${key}`,
      email: account.email,
      first_name: account.firstName,
      last_name: account.lastName,
      phone_number: null,
      date_of_birth: null,
      created_at: now,
      updated_at: now,
      deleted: false,
      disabled: false,
      role: key === 'admin' || key === 'superadmin' ? key : 'user',
    });

  }
  return result;

}

export const populatedDemoUsers = createDemoUsers().filter(
  (user) => ![demoPresetIds.empty, demoPresetIds.onboarding].includes(user.id),
);
