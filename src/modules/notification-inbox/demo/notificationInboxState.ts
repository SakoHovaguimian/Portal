import 'server-only';
import { populatedDemoUsers } from '@/services/demo/demoPresets';
import { portalNotificationInboxStrings as copy } from '@/strings';
import { NotificationCategorySchema } from '../models/notificationCategory';
import { NotificationChannelSchema } from '../models/notificationChannel';
import type { NotificationPreference } from '../models/notificationPreference';
import type { DemoNotificationInboxState } from './models/demoNotificationInboxState';
import type { DemoInboxNotification } from './models/demoInboxNotification';

const owner = globalThis as typeof globalThis & {
  portalNotificationInboxState?: DemoNotificationInboxState;
};
export function defaultNotificationPreferences(): NotificationPreference[] {
  return NotificationCategorySchema.options.flatMap((category) =>
    NotificationChannelSchema.options.map((channel) => ({
      category,
      channel,
      enabled: channel !== 'EMAIL',
    })),
  );
}
export function getDemoNotificationInboxState(): DemoNotificationInboxState {
  if (!owner.portalNotificationInboxState) {
    const templates = [
      {
        category: 'ACTIVITY' as const,
        title: copy.demo.activityTitle,
        body: copy.demo.activityBody,
        destination: '/feature-requests',
      },
      {
        category: 'MENTION' as const,
        title: copy.demo.mentionTitle,
        body: copy.demo.mentionBody,
        destination: '/chat',
      },
      {
        category: 'TAG' as const,
        title: copy.demo.tagTitle,
        body: copy.demo.tagBody,
        destination: '/blog',
      },
      {
        category: 'PRODUCT_UPDATE' as const,
        title: copy.demo.updateTitle,
        body: copy.demo.updateBody,
        destination: '/dashboard',
      },
    ];
    const notifications: DemoInboxNotification[] = populatedDemoUsers.flatMap(
      (user) => {
        const visible: DemoInboxNotification[] = templates.map(
          (template, index) => {
            const instant = new Date(
              Date.now() - (index + 1) * 3600000,
            ).toISOString();
            return {
              ...template,
              id: crypto.randomUUID(),
              userId: user.id,
              createdAt: instant,
              publishedAt: instant,
              readAt: index === 2 ? instant : null,
              deleted: false,
              status: 'PUBLISHED',
              inAppEnabled: true,
              expiresAt: null,
            };
          },
        );
        return [
          ...visible,
          {
            ...visible[0],
            id: crypto.randomUUID(),
            title: copy.demo.archiveTitle,
            body: copy.demo.archiveBody,
            deleted: true,
          },
          {
            ...visible[0],
            id: crypto.randomUUID(),
            title: copy.demo.scheduledTitle,
            body: copy.demo.scheduledBody,
            status: 'SCHEDULED',
            publishedAt: null,
          },
          {
            ...visible[0],
            id: crypto.randomUUID(),
            title: copy.demo.expiredTitle,
            body: copy.demo.expiredBody,
            expiresAt: new Date(Date.now() - 1000).toISOString(),
          },
        ];
      },
    );
    owner.portalNotificationInboxState = {
      notifications,
      preferences: new Map(),
      settings: new Map(),
    };
  }
  return owner.portalNotificationInboxState;
}
export function getDemoEffectiveTimezone(userId: string) {
  const settings = getDemoNotificationInboxState().settings.get(userId);
  return settings?.timezone ?? settings?.lastTimezone ?? 'UTC';
}
export function resetDemoNotificationInboxState(userId?: string) {
  if (!userId) {
    owner.portalNotificationInboxState = undefined;
    return;
  }
  const state = getDemoNotificationInboxState();
  state.notifications = state.notifications.filter(
    (item) => item.userId !== userId,
  );
  state.preferences.delete(userId);
  state.settings.delete(userId);
}
