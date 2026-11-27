import { Badge, UiIcon } from '@/components/ui';
import { strings } from '@/strings';

import styles from '../ExperienceScreen.module.css';

const copy = strings.ui.experienceScreen;
const metrics = [
  { label: copy.conversion, value: 0.248, format: { style: 'percent', maximumFractionDigits: 1 } },
  { label: copy.tickets, value: 134, format: {} },
  { label: copy.retention, value: 0.92, format: { style: 'percent' } },
] as const;
const traffic = [38, 52, 44, 70, 58, 74, 88];

export function ExperiencePreview() {

  function renderMetric({ label, value, format }: (typeof metrics)[number]) {

    return (
      <div key={label} className="grid min-w-0 gap-1">
        <dt className="text-xs font-medium text-secondary">{label}</dt>
        <dd className="m-0 font-display text-2xl font-semibold tracking-tight text-primary tabular-nums sm:text-3xl">
          {new Intl.NumberFormat('en-US', format).format(value)}
        </dd>
      </div>
    );

  }

  function renderBar(height: number, index: number) {

    return (
      <li key={height} className={styles.barSlot}>
        <span className="sr-only">{new Intl.NumberFormat('en-US', { style: 'percent' }).format(height / 100)}</span>
        <span
          aria-hidden="true"
          className={styles.bar}
          style={{ height: `${height}%` }}
          data-highlighted={index === traffic.length - 1 || undefined}
        />
      </li>
    );

  }

  const metricRows = metrics.map(renderMetric);
  const trafficBars = traffic.map(renderBar);

  return (
    <figure aria-labelledby="experience-preview-title" className={styles.preview}>
      <figcaption className={styles.previewHeader}>
        <div className="flex min-w-0 items-center gap-2.5">
          <UiIcon name="chart" className="size-5 shrink-0 text-brand-secondary" />
          <h2 id="experience-preview-title" className="m-0 text-base font-semibold tracking-tight text-primary">
            {copy.liveDashboardMock}
          </h2>
        </div>
        <Badge>{copy.previewSurface}</Badge>
      </figcaption>
      <dl className={styles.metrics}>{metricRows}</dl>
      <div className={styles.chart}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-sm font-semibold text-primary">{copy.trafficOverview}</p>
          <p className="m-0 text-xs text-secondary">{copy.last7Days}</p>
        </div>
        <ol aria-label={copy.trafficOverview} className={styles.plot}>{trafficBars}</ol>
      </div>
    </figure>
  );

}
