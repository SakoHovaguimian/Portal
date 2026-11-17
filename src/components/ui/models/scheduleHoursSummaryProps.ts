export interface ScheduleHoursSummaryProps {
  windows: {
    sequence: number;
    closed: boolean;
    opens_at: string | null;
    closes_at: string | null;
  }[];
}
