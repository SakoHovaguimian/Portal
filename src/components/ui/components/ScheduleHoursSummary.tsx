import type { ScheduleHoursSummaryProps } from '../models/scheduleHoursSummaryProps';
import { strings } from '@/strings';

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
});

export function ScheduleHoursSummary({
  windows,
}: ScheduleHoursSummaryProps) {

  const copy = strings.schedule;
  if (windows.length === 1 && windows[0].closed) { return copy.closed; }

  function renderHoursWindow(window: (typeof windows)[number]) {

    return (
      <span key={window.sequence}>
        {window.opens_at && window.closes_at
          ? copy.hoursRange(
            timeFormat.format(
              new Date(`2000-01-01T${window.opens_at}:00Z`),
            ),
            timeFormat.format(
              new Date(`2000-01-01T${window.closes_at}:00Z`),
            ),
            window.closes_at < window.opens_at,
          )
          : copy.incompleteHours}
      </span>
    );

  }

  const hoursWindows = windows.map(renderHoursWindow);

  return (
    <span className="grid gap-1 tabular-nums">
      {hoursWindows}
    </span>
  );

}
