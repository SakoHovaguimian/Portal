import type { LocationScheduleValue } from './locationSchedule';

export interface LocationScheduleTimeProps {
  schedule: LocationScheduleValue;
  endpoint: 'startsAt' | 'endsAt';
  noEnd: string;
}
