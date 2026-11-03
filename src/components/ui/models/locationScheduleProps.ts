import type { LocationScheduleValue } from './locationSchedule';

export interface LocationScheduleProps {
  schedule: LocationScheduleValue;
  copy: {
    starts: string;
    ends: string;
    timezone: string;
    noEnd: string;
    labelValue: (label: string, value: string) => string;
  };
}
