import { Card } from './Card';

export function MetricCard({ eyebrow, value, caption }: { eyebrow: string; value: string; caption: string }) {
  return (
    <Card className="gap-3 bg-linear-to-br from-primary to-secondary_subtle">
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">{eyebrow}</p>
      <div className="text-4xl font-semibold tracking-tight text-primary">{value}</div>
      <h3 className="m-0 text-sm font-medium text-secondary">{caption}</h3>
    </Card>
  );
}
