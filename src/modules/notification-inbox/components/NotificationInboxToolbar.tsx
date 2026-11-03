import { useState } from 'react';
import { Button, Card, SegmentedTabs, UiIcon } from '@/components/ui';
import { portalNotificationInboxStrings as copy } from '@/strings';
import type { NotificationInboxView } from '../models/notificationInboxView';
import type { NotificationInboxToolbarProps } from '../models/notificationInboxToolbarProps';
import { NotificationDirectoryFilters } from './NotificationDirectoryFilters';

const allView: NotificationInboxView = 'all';
const unreadView: NotificationInboxView = 'unread';
const readView: NotificationInboxView = 'read';

export function NotificationInboxToolbar({
  query,
  counts,
  filtered,
  busy,
  hasNotifications,
  update,
  onReadAll,
  onArchiveAll,
}: NotificationInboxToolbarProps) {

  const [expanded, setExpanded] = useState(false);
  const view: NotificationInboxView =
    query.read === undefined ? 'all' : query.read ? 'read' : 'unread';

  const toggleExpanded = () => {

    const toggleExpandedValue = (value: boolean) => !value;
    setExpanded(toggleExpandedValue);

  };
  return (
    <Card className="grid gap-5">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <SegmentedTabs<NotificationInboxView>
          value={view}
          label={copy.viewLabel}
          disabled={busy}
          tabs={[
            {
              value: allView,
              label: copy.views.all,
              panelId: 'notification-results',
            },
            {
              value: unreadView,
              label: counts
                ? copy.unreadViewLabel(counts.unreadCount)
                : copy.views.unread,
              panelId: 'notification-results',
            },
            {
              value: readView,
              label: copy.views.read,
              panelId: 'notification-results',
            },
          ]}
          onValueChange={(value) =>
            update({
              read: value === 'all' ? undefined : String(value === 'read'),
              offset: undefined,
            })
          }
        />
        <Button
          variant="ghost"
          className="px-3"
          aria-expanded={expanded}
          aria-controls={expanded ? 'notification-bulk-actions' : undefined}
          onClick={toggleExpanded}
        >
          <UiIcon name="layers" />
          {copy.manageAction}
          <UiIcon
            name="chevronDown"
            className={`size-4 ${expanded ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>
      <NotificationDirectoryFilters query={query} update={update} />
      {expanded && (
        <div
          id="notification-bulk-actions"
          className="grid gap-3 border-t border-secondary pt-5"
        >
          <div className="grid gap-1">
            <h2 className="m-0 text-sm font-semibold text-primary">
              {copy.bulkTitle}
            </h2>
            <p className="m-0 max-w-3xl text-sm text-secondary">
              {filtered ? copy.scopeFilteredHint : copy.scopeAllHint}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={busy || !hasNotifications}
              onClick={() => onReadAll(true)}
            >
              <UiIcon name="check" />
              {filtered ? copy.markMatchingReadAction : copy.markAllReadAction}
            </Button>
            <Button
              variant="secondary"
              disabled={busy || !hasNotifications}
              onClick={() => onReadAll(false)}
            >
              <UiIcon name="mail" />
              {filtered
                ? copy.markMatchingUnreadAction
                : copy.markAllUnreadAction}
            </Button>
            <Button
              variant="destructive"
              disabled={busy || !hasNotifications}
              onClick={onArchiveAll}
            >
              <UiIcon name="box" />
              {filtered ? copy.archiveMatchingAction : copy.archiveAllAction}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

}
