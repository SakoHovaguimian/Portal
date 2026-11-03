'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServiceContainer, useSessionState } from '@/providers/AppProviders';
import type {
  NotificationInboxQuery,
  NotificationInboxFilters,
} from './models/notificationInboxQuery';
import type { NotificationBulkReadInput } from './models/notificationBulkReadInput';
import type { NotificationArchiveInput } from './models/notificationArchiveInput';
import type { NotificationPreferencesInput } from './models/notificationPreference';
import type { NotificationReadMutationInput } from './models/notificationReadMutationInput';
import { notificationInboxQueryKeys as keys } from './queryKeys';

export function useNotificationInbox(query: NotificationInboxQuery) {

  const { notificationInboxService: service } = useServiceContainer();
  const inboxQuery = useQuery({
    queryKey: keys.list(query),
    queryFn: ({ signal }) => service.inbox(query, signal),
  });

  return inboxQuery;

}

export function useNotificationCounts(
  filters: Omit<NotificationInboxFilters, 'read'> = {},
) {

  const { notificationInboxService: service } = useServiceContainer();
  const { session } = useSessionState();
  const countsQuery = useQuery({
    queryKey: keys.counts(filters),
    queryFn: ({ signal }) => service.counts(filters, signal),
    enabled: Boolean(session),
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });

  return countsQuery;

}

export function useNotificationPreferences() {

  const { notificationInboxService: service } = useServiceContainer();
  const preferencesQuery = useQuery({
    queryKey: keys.preferences,
    queryFn: ({ signal }) => service.preferences(signal),
  });

  return preferencesQuery;

}

export function useNotificationSettings() {

  const { notificationInboxService: service } = useServiceContainer();
  const { session } = useSessionState();
  const settingsQuery = useQuery({
    queryKey: keys.settings,
    queryFn: ({ signal }) => service.settings(signal),
    enabled: Boolean(session),
  });

  return settingsQuery;

}

function useInboxMutation<T, R>(mutationFn: (input: T) => Promise<R>) {

  const cache = useQueryClient();
  const invalidateNotificationInbox = () => {

    const invalidatedQueries = Promise.all([
      cache.invalidateQueries({ queryKey: keys.all }),
    ]);
    return invalidatedQueries;

  };
  const mutation = useMutation({
    mutationFn,
    onSuccess: invalidateNotificationInbox,
  });

  return mutation;

}

export function useNotificationRead() {

  const { notificationInboxService: service } = useServiceContainer();
  const setNotificationRead = (input: NotificationReadMutationInput) =>
    service.setRead(input.id, input.read);
  const mutation = useInboxMutation(setNotificationRead);
  return mutation;

}

export function useNotificationBulkRead() {

  const { notificationInboxService: service } = useServiceContainer();
  const setNotificationReadState = (input: NotificationBulkReadInput) =>
    service.setBulkRead(input);
  const mutation = useInboxMutation(setNotificationReadState);
  return mutation;

}

export function useArchiveNotification() {

  const { notificationInboxService: service } = useServiceContainer();
  const archiveNotification = (id: string) => service.archive(id);
  const mutation = useInboxMutation(archiveNotification);
  return mutation;

}

export function useArchiveNotifications() {

  const { notificationInboxService: service } = useServiceContainer();
  const archiveNotifications = (input: NotificationArchiveInput) =>
    service.archiveBulk(input);
  const mutation = useInboxMutation(archiveNotifications);
  return mutation;

}

export function useSaveNotificationPreferences() {

  const { notificationInboxService: service } = useServiceContainer();
  const saveNotificationPreferences = (
    input: NotificationPreferencesInput,
  ) => service.savePreferences(input);
  const mutation = useInboxMutation(saveNotificationPreferences);
  return mutation;

}

export function useSaveNotificationTimezone() {

  const { notificationInboxService: service } = useServiceContainer();
  const saveNotificationTimezone = (timezone: string | null) =>
    service.setTimezone(timezone);
  const mutation = useInboxMutation(saveNotificationTimezone);
  return mutation;

}
