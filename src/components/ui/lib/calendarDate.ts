import { parseDate } from '@internationalized/date';

export function calendarDate(value?: string) {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}
