import type { LocationScheduleValue } from './locationSchedule';

export interface LocationScheduleItemProps {
  name: string;
  schedule: LocationScheduleValue;
  copy: {
    starts: string;
    ends: string;
    timezone: string;
    noEnd: string;
  };
}
