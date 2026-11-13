import 'server-only';

import { projectConfiguration } from '@/config/projectConfiguration';
import { populatedDemoUsers as seedAccounts } from '@/services/demo/demoPresets';
import { portalAccountToolsStrings as copy } from '@/strings';

import type { DemoAccountDevice } from './models/demoAccountDevice';
import type { DemoAccountToolsState } from './models/demoAccountToolsState';
import { AccountDeviceTypeSchema } from '../models/accountDeviceType';
import type { NotificationDelivery } from '../models/notificationDelivery';
import type { NotificationDeliveryAttempt } from '../models/notificationDeliveryAttempt';

const globalAccountTools = globalThis as typeof globalThis & {
  portalAccountToolsState?: DemoAccountToolsState;
};

// **************************************
// MARK: - GET DEMO ACCOUNT TOOLS STATE
// **************************************

export function getDemoAccountToolsState(): DemoAccountToolsState {

  if (!globalAccountTools.portalAccountToolsState) {

    const accounts = seedAccounts;
    const now = new Date().toISOString();
    const before = new Date(Date.now() - 86400000).toISOString();
    const acceptedId = crypto.randomUUID();
    const failedId = crypto.randomUUID();
    const devices = accounts.flatMap<DemoAccountDevice>((user) => [
      {
        id: crypto.randomUUID(),
        userId: user.id,
        deviceType: AccountDeviceTypeSchema.enum.Web,
        createdAt: before,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        userId: user.id,
        deviceType: 'iOS',
        createdAt: before,
        updatedAt: before,
      },
    ]);
    const deliveries: NotificationDelivery[] = [
      {
        id: acceptedId,
        notificationId: crypto.randomUUID(),
        channel: 'EMAIL',
        status: 'ACCEPTED',
        attemptCount: 1,
        nextAttemptAt: null,
        acceptedAt: now,
        error: null,
        skipReason: null,
        createdAt: before,
      },
      {
        id: failedId,
        notificationId: crypto.randomUUID(),
        channel: 'PUSH',
        status: 'FAILED',
        attemptCount: 1,
        nextAttemptAt: null,
        acceptedAt: null,
        error: copy.demo.failedErrorHint,
        skipReason: null,
        createdAt: before,
      },
      {
        id: crypto.randomUUID(),
        notificationId: crypto.randomUUID(),
        channel: 'PUSH',
        status: 'SKIPPED',
        attemptCount: 0,
        nextAttemptAt: null,
        acceptedAt: null,
        error: null,
        skipReason: copy.demo.skippedReason,
        createdAt: before,
      },
    ];
    const attempts = new Map<string, NotificationDeliveryAttempt[]>([
      [
        acceptedId,
        [
          {
            id: crypto.randomUUID(),
            attemptNumber: 1,
            startedAt: before,
            finishedAt: now,
            outcome: 'ACCEPTED',
            retryable: false,
            error: null,
          },
        ],
      ],
      [
        failedId,
        [
          {
            id: crypto.randomUUID(),
            attemptNumber: 1,
            startedAt: before,
            finishedAt: now,
            outcome: 'FAILED',
            retryable: true,
            error: copy.demo.failedErrorHint,
          },
        ],
      ],
    ]);
    globalAccountTools.portalAccountToolsState = {
      devices: projectConfiguration.starterData === 'empty' ? [] : devices,
      deliveries: projectConfiguration.starterData === 'empty' ? [] : deliveries,
      attempts: projectConfiguration.starterData === 'empty' ? new Map() : attempts,
    };

  }
  return globalAccountTools.portalAccountToolsState;

}

// **************************************
// MARK: - RESET DEMO ACCOUNT TOOLS STATE
// **************************************

export function resetDemoAccountToolsState(userId?: string) {

  if (!userId) {

    globalAccountTools.portalAccountToolsState = undefined;
    return;

  }
  const state = globalAccountTools.portalAccountToolsState;
  if (state) {

    const remainingDevices = state.devices.filter(
      (device) => device.userId !== userId,
    );
    state.devices = remainingDevices;

  }

}
