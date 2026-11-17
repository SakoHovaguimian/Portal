import { locationScheduleFormat } from '../lib/locationScheduleFormat';
import type { LocationScheduleTimeProps } from '../models/locationScheduleTimeProps';
import type { LocationScheduleTimezoneProps } from '../models/locationScheduleTimezoneProps';

export function LocationScheduleTime({
  schedule,
  endpoint,
  noEnd,
}: LocationScheduleTimeProps) {

  const value = schedule[endpoint];
  if (!value) { return <span className="text-secondary">{noEnd}</span>; }
  const { timezone } = locationScheduleFormat(schedule.timezone);
  const date = new Date(value);
  return (
    <time
      dateTime={value}
      className="grid gap-1 whitespace-nowrap tabular-nums"
    >
      <span>
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: timezone,
        }).format(date)}
      </span>
      <span className="text-secondary">
        {new Intl.DateTimeFormat('en-US', {
          timeStyle: 'short',
          timeZone: timezone,
        }).format(date)}
      </span>
    </time>
  );

}

export function LocationScheduleTimezone({
  schedule,
}: LocationScheduleTimezoneProps) {

  const { timezone } = locationScheduleFormat(schedule.timezone);
  const format = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  const abbreviation = (value: string) => {

    const timezoneName = format
      .formatToParts(new Date(value))
      .find((part) => part.type === 'timeZoneName')!.value;

    return timezoneName;

  };
  // Preserve both offsets when the schedule crosses a daylight-saving boundary.
  const names = [
    ...new Set([
      abbreviation(schedule.startsAt),
      ...(schedule.endsAt ? [abbreviation(schedule.endsAt)] : []),
    ]),
  ];
  return (
    <abbr
      title={timezone}
      className="whitespace-nowrap text-sm text-secondary no-underline"
    >
      {names.join(' / ')}
    </abbr>
  );

}
