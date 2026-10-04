export type DashboardOverviewTransport = {
  models: Array<{
    model: string;
    display_name: string;
    total_count: number;
    period_count: number;
    growth_percent?: number | null;
  }>;
  date_range: { from: string; to: string };
};
