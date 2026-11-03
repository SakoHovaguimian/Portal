import { z } from 'zod';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { NotificationPageSchema } from '../models/notificationPage';
import { NotificationCountsSchema } from '../models/notificationCounts';
import { NotificationMutationResultSchema } from '../models/notificationMutationResult';
import {
  NotificationInboxQuerySchema,
  type NotificationInboxQuery,
  type NotificationInboxFilters,
} from '../models/notificationInboxQuery';
import {
  NotificationArchiveInputSchema,
  type NotificationArchiveInput,
} from '../models/notificationArchiveInput';
import {
  NotificationBulkReadInputSchema,
  type NotificationBulkReadInput,
} from '../models/notificationBulkReadInput';
import {
  NotificationPreferenceSchema,
  NotificationPreferencesInputSchema,
  type NotificationPreferencesInput,
} from '../models/notificationPreference';
import {
  NotificationTimezoneInputSchema,
  NotificationDetectedTimezoneInputSchema,
} from '../models/notificationTimezone';
import { NotificationUserSettingsSchema } from '../models/notificationUserSettings';
import { notificationInboxQueryParams } from '../notificationInboxQueryParams';

const root = '/portal/notification-inbox';
export class NotificationInboxService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - LIST NOTIFICATION INBOX
  // **************************************

  async inbox(query: NotificationInboxQuery, signal?: AbortSignal) {

    return NotificationPageSchema.parse(
      await this.api.request(
        `${root}?${notificationInboxQueryParams(NotificationInboxQuerySchema.parse(query))}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - GET NOTIFICATION COUNTS
  // **************************************

  async counts(
    filters: Omit<NotificationInboxFilters, 'read'> = {},
    signal?: AbortSignal,
  ) {

    return NotificationCountsSchema.parse(
      await this.api.request(
        `${root}/counts?${notificationInboxQueryParams(filters)}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - SET NOTIFICATION READ STATE
  // **************************************

  async setRead(id: string, read: boolean) {

    return NotificationMutationResultSchema.parse(
      await this.api.request(
        `${root}/${encodeURIComponent(z.string().uuid().parse(id))}/read`,
        { method: 'PUT', body: { read } },
      ),
    );

  }

  // **************************************
  // MARK: - SET BULK NOTIFICATION READ STATE
  // **************************************

  async setBulkRead(input: NotificationBulkReadInput) {

    return NotificationMutationResultSchema.parse(
      await this.api.request(`${root}/read`, {
        method: 'PUT',
        body: NotificationBulkReadInputSchema.parse(input),
      }),
    );

  }

  // **************************************
  // MARK: - ARCHIVE NOTIFICATION
  // **************************************

  async archive(id: string) {

    return NotificationMutationResultSchema.parse(
      await this.api.request(
        `${root}/${encodeURIComponent(z.string().uuid().parse(id))}`,
        { method: 'DELETE' },
      ),
    );

  }

  // **************************************
  // MARK: - ARCHIVE NOTIFICATIONS
  // **************************************

  async archiveBulk(input: NotificationArchiveInput) {

    return NotificationMutationResultSchema.parse(
      await this.api.request(root, {
        method: 'DELETE',
        body: NotificationArchiveInputSchema.parse(input),
      }),
    );

  }

  // **************************************
  // MARK: - GET NOTIFICATION PREFERENCES
  // **************************************

  async preferences(signal?: AbortSignal) {

    return z
      .array(NotificationPreferenceSchema)
      .parse(await this.api.request(`${root}/preferences`, { signal }));

  }

  // **************************************
  // MARK: - SAVE NOTIFICATION PREFERENCES
  // **************************************

  async savePreferences(input: NotificationPreferencesInput) {

    return z.array(NotificationPreferenceSchema).parse(
      await this.api.request(`${root}/preferences`, {
        method: 'PUT',
        body: NotificationPreferencesInputSchema.parse(input),
      }),
    );

  }

  // **************************************
  // MARK: - GET NOTIFICATION SETTINGS
  // **************************************

  async settings(signal?: AbortSignal) {

    return NotificationUserSettingsSchema.parse(
      await this.api.request(`${root}/settings`, { signal }),
    );

  }

  // **************************************
  // MARK: - SET NOTIFICATION TIMEZONE
  // **************************************

  async setTimezone(timezone: string | null) {

    return NotificationUserSettingsSchema.parse(
      await this.api.request(`${root}/settings/timezone`, {
        method: 'PUT',
        body: NotificationTimezoneInputSchema.parse({ timezone }),
      }),
    );

  }

  // **************************************
  // MARK: - SYNC DETECTED NOTIFICATION TIMEZONE
  // **************************************

  async syncDetectedTimezone(lastTimezone: string) {

    return NotificationUserSettingsSchema.parse(
      await this.api.request(`${root}/settings/last-timezone`, {
        method: 'PUT',
        body: NotificationDetectedTimezoneInputSchema.parse({ lastTimezone }),
      }),
    );

  }

}
