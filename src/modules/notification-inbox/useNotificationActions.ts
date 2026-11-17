'use client';

import { useRef } from 'react';

import { usePresentationService } from '@/presentation/PresentationProvider';
import { portalNotificationInboxStrings as copy } from '@/strings';

import {
  useNotificationRead,
  useNotificationBulkRead,
  useArchiveNotification,
  useArchiveNotifications,
} from './hooks';
import type { NotificationInboxItem } from './models/notificationInboxItem';
import type { NotificationInboxFilters } from './models/notificationInboxQuery';
import type { NotificationMutationResult } from './models/notificationMutationResult';

export function useNotificationActions(filters: NotificationInboxFilters) {

  const read = useNotificationRead();
  const readBulk = useNotificationBulkRead();
  const archive = useArchiveNotification();
  const archiveBulk = useArchiveNotifications();
  const presentation = usePresentationService();
  const busy = useRef(false);
  const filtered = Object.values(filters).some((value) => value !== undefined);

  async function performNotificationMutation(
    operation: () => Promise<NotificationMutationResult>,
    archived = false,
    confirm?: () => Promise<boolean>,
  ) {

    if (busy.current) { return; }
    busy.current = true;
    read.reset();
    readBulk.reset();
    archive.reset();
    archiveBulk.reset();
    try {

      if (confirm && !(await confirm())) { return; }
      const result = await operation();
      void presentation.showToast({
        title: archived ? copy.archivedTitle : copy.readChangedTitle,
        description: copy.mutationDescription(result.affectedCount),
        intent: 'success',
      });

    } catch {
      /* The inline error and unchanged records remain available for retry. */
    } finally {
      busy.current = false;
    }

  }

  function readItem(item: NotificationInboxItem) {

    const operation = () =>
      read.mutateAsync({ id: item.id, read: !item.readAt });
    void performNotificationMutation(operation);

  }

  function readAll(value: boolean) {

    const operation = () =>
      readBulk.mutateAsync(
        filtered
          ? { scope: 'FILTERED', filters, read: value }
          : { scope: 'ALL', read: value },
      );
    void performNotificationMutation(operation);

  }

  function markAllRead() {

    const operation = () =>
      readBulk.mutateAsync({ scope: 'ALL', read: true });
    void performNotificationMutation(operation);

  }

  function archiveItem(item: NotificationInboxItem) {

    const operation = () => archive.mutateAsync(item.id);
    const confirm = () =>
      presentation.showAlert({
        title: copy.archiveTitle,
        description: copy.archiveDescription(item.title),
        tone: 'danger',
        confirmLabel: copy.archiveAction,
        cancelLabel: copy.cancelAction,
      });
    void performNotificationMutation(operation, true, confirm);

  }

  function archiveAll() {

    const operation = () =>
      archiveBulk.mutateAsync(
        filtered ? { scope: 'FILTERED', filters } : { scope: 'ALL' },
      );
    const confirm = () =>
      presentation.showAlert({
        title: filtered ? copy.archiveMatchingTitle : copy.archiveAllTitle,
        description: filtered
          ? copy.archiveMatchingDescription
          : copy.archiveAllDescription,
        tone: 'danger',
        confirmLabel: filtered
          ? copy.archiveMatchingAction
          : copy.archiveAllAction,
        cancelLabel: copy.cancelAction,
      });
    void performNotificationMutation(operation, true, confirm);

  }

  const actions = {
    busy:
      read.isPending ||
      readBulk.isPending ||
      archive.isPending ||
      archiveBulk.isPending,
    error: read.error ?? readBulk.error ?? archive.error ?? archiveBulk.error,
    readItem,
    readAll,
    markAllRead,
    archiveItem,
    archiveAll,
  };

  return actions;

}
