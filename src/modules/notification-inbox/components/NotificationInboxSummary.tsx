import { Badge, UiIcon } from '@/components/ui';
import { portalNotificationInboxStrings as copy } from '@/strings';
import type { NotificationInboxSummaryProps } from '../models/notificationInboxSummaryProps';

export function NotificationInboxSummary({
  counts,
  unavailable,
  filtered,
}: NotificationInboxSummaryProps) {

  if (unavailable) { return <span role="status">{copy.countUnavailable}</span>; }
  if (!counts) { return <span role="status">{copy.loadingSummaryHint}</span>; }
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
      <Badge
        intent="brand"
        className="shrink-0 gap-2 whitespace-nowrap px-3 py-1.5"
      >
        <UiIcon
          name={counts.unreadCount ? 'bell' : 'check'}
          className="size-4 shrink-0"
        />
        {copy.unreadCount(counts.unreadCount)}
      </Badge>
      <span className="text-sm text-secondary">
        {filtered
          ? copy.matchingTotalHint(counts.totalCount)
          : copy.inboxTotalHint(counts.totalCount)}
      </span>
    </div>
  );

}
