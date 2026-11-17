import { locationScheduleFormat } from '../lib/locationScheduleFormat';
import type { LocationScheduleProps } from '../models/locationScheduleProps';

export function LocationSchedule({
  schedule,
  copy,
}: LocationScheduleProps) {

  const { timezone, format } = locationScheduleFormat(schedule.timezone);
  return (
    <div className="grid gap-1 text-sm">
      <span>
        <time dateTime={schedule.startsAt}>
          {copy.labelValue(
            copy.starts,
            format.format(new Date(schedule.startsAt)),
          )}
        </time>
      </span>
      <span>
        {schedule.endsAt ? (
          <time dateTime={schedule.endsAt}>
            {copy.labelValue(
              copy.ends,
              format.format(new Date(schedule.endsAt)),
            )}
          </time>
        ) : (
          copy.labelValue(copy.ends, copy.noEnd)
        )}
      </span>
      <span className="text-secondary wrap-break-word">
        {copy.labelValue(copy.timezone, timezone)}
      </span>
    </div>
  );

}
