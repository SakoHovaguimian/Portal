import { Card } from './Card';

export function MetricCard({ eyebrow, value, caption }: { eyebrow: string; value: string; caption: string }) {
  const seed = eyebrow.length + caption.length;
  const points = Array.from({ length: 7 }, (_, index) => {
    const x = 4 + index * 15;
    const y = 24 + ((seed + index * 11) % 16);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="grid gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">{eyebrow}</p>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-primary">{value}</div>
        </div>
        <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
          Live
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-secondary bg-secondary_subtle p-3">
        <svg viewBox="0 0 100 48" className="h-12 w-full text-brand-secondary" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          <polyline
            points="4,36 19,32 34,34 49,22 64,26 79,18 94,20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="m-0 text-sm font-medium text-secondary">{caption}</h3>
    </Card>
  );
}
