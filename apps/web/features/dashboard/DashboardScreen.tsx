'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, DataTable, MetricCard } from '@semantic-web/ui';
import { useDashboardOverview, useDashboardModels, useDashboardRecords } from './hooks';
import { useDashboardChromeStore } from '../../stores/dashboardChromeStore';

export function DashboardScreen() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model') ?? 'featureRequest';
  const search = searchParams.get('search') ?? '';
  const overview = useDashboardOverview();
  const models = useDashboardModels();
  const records = useDashboardRecords(model, search);
  const { density, setDensity } = useDashboardChromeStore();

  const columns = useMemo(() => {
    const rows = records.data?.data ?? [];
    const keys = Object.keys(rows[0] ?? {}).slice(0, 4);
    return keys.map((key) => ({ key, header: key, render: (row: Record<string, unknown>) => String(row[key] ?? '') }));
  }, [records.data]);

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden bg-linear-to-br from-primary via-primary to-secondary_subtle">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="grid gap-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Operational Surface</p>
            <h2 className="m-0 font-display text-4xl font-semibold tracking-tight text-primary">Keep the shell focused and open immersive routes only when they deserve the whole screen.</h2>
            <p className="max-w-3xl text-sm leading-7 text-secondary">
              The app shell handles dense day-to-day workflows while the immersive route delivers a polished full-page hero experience for storytelling and launch flows.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={'/experience' as never}>Open experience</Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.data?.models.map((item) => (
          <MetricCard
            key={item.model}
            eyebrow={item.displayName}
            value={String(item.totalCount)}
            caption={`${item.periodCount} new in range`}
          />
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-primary">Model Explorer</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">EUI-inspired operational views with semantic backend parity.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')}>
              Comfortable
            </Button>
            <Button variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')}>
              Compact
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="grid gap-4">
          <h3 className="m-0 text-xl font-semibold text-primary">Records</h3>
          {columns.length > 0 ? <DataTable columns={columns} rows={records.data?.data ?? []} /> : <p className="m-0 text-sm text-secondary">No records available.</p>}
        </Card>
        <Card className="grid gap-4">
          <h3 className="m-0 text-xl font-semibold text-primary">Registered models</h3>
          <div className="grid gap-3">
            {models.data?.map((entry) => (
              <div key={entry.key} className="rounded-2xl border border-secondary bg-secondary_subtle/70 p-4">
                <strong className="text-primary">{entry.displayName}</strong>
                <div className="mt-1 text-sm text-secondary">{entry.recordCount} records</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
