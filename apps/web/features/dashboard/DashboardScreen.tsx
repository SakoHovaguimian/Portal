'use client';

import { useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, DataTable, MetricCard } from '@semantic-web/ui';
import { useDashboardOverview, useDashboardModels, useDashboardRecords } from './hooks';
import { useDashboardChromeStore } from '../../stores/dashboardChromeStore';

const comparisonMonths = ['Dec 20', 'Jan 21', 'Feb 21', 'Mar 21', 'Apr 21', 'May 21'];
const directRevenue = [700, 3900, 3200, 5100, 2100, 1800];
const indirectRevenue = [1600, 2600, 1900, 3800, 4700, 3900];
const avgOrderValueCurrent = [52, 24, 18, 28, 20, 25, 17, 31, 19, 23, 21, 26];
const avgOrderValuePrevious = [34, 12, 38, 10, 27, 15, 23, 19, 17, 29, 13, 16];
const salesOverTimeCurrent = [180, 260, 340, 420, 390, 560, 610, 720, 860, 940];
const salesOverTimePrevious = [420, 360, 330, 300, 350, 390, 410, 430, 470, 520];
const salesOverTimeForecast = [120, 140, 180, 160, 210, 240, 220, 260, 300, 340];
const salesVsRefundsSales = [5600, 7200, 6100, 6800, 5300, 7000];
const salesVsRefundsRefunds = [-1800, -1200, -2500, -1700, -3200, -1400];

const topChannels = [
  { source: 'Github.com', visitors: '2.4K', revenue: '$3,877', sales: '267', conversion: '4.7%' },
  { source: 'Facebook', visitors: '2.2K', revenue: '$3,426', sales: '249', conversion: '4.4%' },
  { source: 'Google (organic)', visitors: '2.0K', revenue: '$2,444', sales: '224', conversion: '4.2%' },
  { source: 'Vimeo.com', visitors: '1.9K', revenue: '$2,236', sales: '220', conversion: '4.2%' },
  { source: 'Indiehackers.com', visitors: '1.7K', revenue: '$2,034', sales: '204', conversion: '3.9%' },
] as const;

const refundReasons = [
  { label: 'Having difficulties using the product', value: 48.7, color: 'var(--color-brand-500)' },
  { label: 'Missing features I need', value: 24.9, color: '#6366f1' },
  { label: 'Not satisfied about the quality of the product', value: 19.3, color: '#60a5fa' },
  { label: "The product doesn't look as advertised", value: 9.6, color: '#4ade80' },
  { label: 'Other', value: 9.3, color: '#cbd5e1' },
] as const;

function buildLinePath(values: number[], width: number, height: number, padding = 10) {
  if (values.length === 0) {
    return '';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function DashboardPanel({
  eyebrow,
  title,
  value,
  delta,
  children,
  legend,
}: {
  eyebrow: string;
  title: string;
  value?: string;
  delta?: string;
  children: ReactNode;
  legend?: ReactNode;
}) {
  return (
    <Card className="grid gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">{eyebrow}</p>
          <h3 className="mt-2 text-base font-semibold text-primary">{title}</h3>
        </div>
        {legend}
      </div>
      {value ? (
        <div className="flex items-center gap-2">
          <div className="text-3xl font-semibold tracking-tight text-primary">{value}</div>
          {delta ? (
            <span className="inline-flex rounded-full bg-brand-primary px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
              {delta}
            </span>
          ) : null}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

function LineChart({
  primary,
  secondary,
  tertiary,
}: {
  primary: number[];
  secondary?: number[];
  tertiary?: number[];
}) {
  return (
    <svg viewBox="0 0 320 150" className="h-44 w-full" preserveAspectRatio="none" aria-hidden="true">
      {[24, 62, 100, 138].map((y) => (
        <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="var(--color-border-tertiary)" strokeWidth="1" />
      ))}
      {secondary ? <path d={buildLinePath(secondary, 320, 150, 12)} fill="none" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="2" strokeLinecap="round" /> : null}
      {tertiary ? <path d={buildLinePath(tertiary, 320, 150, 12)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> : null}
      <path d={buildLinePath(primary, 320, 150, 12)} fill="none" stroke="var(--color-brand-500)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ComparisonBars() {
  const maxValue = Math.max(...directRevenue, ...indirectRevenue);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-2 text-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-solid" />
          <strong>$1.7K</strong> Direct
        </span>
        <span className="inline-flex items-center gap-2 text-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <strong>$2.4K</strong> Indirect
        </span>
      </div>
      <div className="grid gap-3">
        <div className="flex h-40 items-end gap-4">
          {comparisonMonths.map((month, index) => (
            <div key={month} className="flex min-w-0 flex-1 items-end justify-center gap-1.5">
              <span className="w-4 rounded-t-md bg-brand-solid/85" style={{ height: `${(directRevenue[index] / maxValue) * 100}%` }} />
              <span className="w-4 rounded-t-md bg-sky-400" style={{ height: `${(indirectRevenue[index] / maxValue) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-tertiary">
          {comparisonMonths.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountriesDonut() {
  return (
    <div className="grid place-items-center gap-6 py-2">
      <div
        className="relative h-52 w-52 rounded-full"
        style={{
          background:
            'conic-gradient(var(--color-brand-500) 0 38%, #60a5fa 38% 66%, #818cf8 66% 100%)',
        }}
      >
        <div className="absolute inset-5 rounded-full bg-primary" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-secondary">
        {[
          ['United States', 'var(--color-brand-500)'],
          ['Italy', '#60a5fa'],
          ['Other', '#818cf8'],
        ].map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TopChannelsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-secondary bg-primary">
      <div className="grid grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] gap-3 border-b border-secondary bg-secondary_subtle px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
        <span>Source</span>
        <span>Visitors</span>
        <span>Revenue</span>
        <span>Sales</span>
        <span>Conversion</span>
      </div>
      <div className="divide-y divide-secondary">
        {topChannels.map((channel) => (
          <div key={channel.source} className="grid grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] gap-3 px-4 py-3 text-sm text-secondary">
            <span className="font-medium text-primary">{channel.source}</span>
            <span>{channel.visitors}</span>
            <span className="text-emerald-500">{channel.revenue}</span>
            <span>{channel.sales}</span>
            <span className="text-sky-500">{channel.conversion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesVsRefundsBars() {
  const maxValue = Math.max(...salesVsRefundsSales, ...salesVsRefundsRefunds.map((value) => Math.abs(value)));

  return (
    <div className="grid gap-4">
      <div className="flex h-44 items-center gap-4">
        {comparisonMonths.map((month, index) => (
          <div key={month} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
            <div className="flex h-20 items-end">
              <span className="w-6 rounded-t-md bg-brand-solid/85" style={{ height: `${(salesVsRefundsSales[index] / maxValue) * 100}%` }} />
            </div>
            <div className="flex h-20 items-start">
              <span className="w-6 rounded-b-md bg-indigo-200 dark:bg-indigo-300" style={{ height: `${(Math.abs(salesVsRefundsRefunds[index]) / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-tertiary">
        {comparisonMonths.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}

function RefundReasonsCard() {
  return (
    <Card className="grid gap-5">
      <div>
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Breakdown</p>
        <h3 className="mt-2 text-xl font-semibold text-primary">Reason for refunds</h3>
      </div>
      <div className="rounded-xl border border-secondary bg-secondary_subtle p-4">
        <div className="flex h-4 overflow-hidden rounded-full">
          {refundReasons.map((reason) => (
            <span key={reason.label} style={{ width: `${reason.value}%`, backgroundColor: reason.color }} />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {refundReasons.map((reason) => (
            <div key={reason.label} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex items-start gap-2 text-secondary">
                <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: reason.color }} />
                <span>{reason.label}</span>
              </div>
              <span className="font-medium text-primary">{reason.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

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
    return keys.map((key) => ({
      key,
      header: key,
      render: (row: Record<string, unknown>) => String(row[key] ?? ''),
    }));
  }, [records.data]);

  const visibleRows = records.data?.data.length ?? 0;

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-secondary bg-secondary_subtle px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary">Dashboard</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-medium text-secondary">Nov 20, 2024 - Dec 19, 2024</span>
              <Button asChild>
                <Link href={'/experience' as never}>Open showcase</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-3 px-6 py-6">
          <p className="m-0 max-w-4xl text-sm leading-7 text-secondary">
            The dashboard now mirrors the flatter analytics layout from your reference: neutral shell chrome, white data panels, selected accent states, and mocked charts layered alongside the existing data explorer.
          </p>
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

      <Card className="grid gap-4">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Density</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">Model explorer</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">Keep this control on its own row so it reads like workspace chrome instead of a competing analytics card.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')}>
            Comfortable
          </Button>
          <Button variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')}>
            Compact
          </Button>
        </div>
        <div className="rounded-xl border border-secondary bg-secondary_subtle p-4">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Selected model</p>
          <p className="mt-2 text-sm font-semibold text-primary">{model}</p>
          <p className="mt-1 text-sm text-secondary">{visibleRows} visible records in the current query.</p>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel eyebrow="Sales" title="Direct VS Indirect" value="$1.7K">
          <ComparisonBars />
        </DashboardPanel>
        <DashboardPanel
          eyebrow="Order value"
          title="AVG Order Value"
          value="$72"
          delta="+34%"
          legend={
            <div className="flex items-center gap-4 text-xs font-medium text-tertiary">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-solid" />
                Current
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Previous
              </span>
            </div>
          }
        >
          <LineChart primary={avgOrderValueCurrent} secondary={avgOrderValuePrevious} />
        </DashboardPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <DashboardPanel eyebrow="Audience" title="Top Countries">
          <CountriesDonut />
        </DashboardPanel>
        <DashboardPanel eyebrow="Acquisition" title="Top Channels">
          <TopChannelsTable />
        </DashboardPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel
          eyebrow="Stores"
          title="Sales Over Time"
          value="1,482"
          delta="-22%"
          legend={
            <div className="flex items-center gap-4 text-xs font-medium text-tertiary">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-solid" />
                Current
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Previous
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Forecast
              </span>
            </div>
          }
        >
          <LineChart primary={salesOverTimeCurrent} secondary={salesOverTimePrevious} tertiary={salesOverTimeForecast} />
        </DashboardPanel>
        <DashboardPanel eyebrow="Finance" title="Sales VS Refunds" value="+$6,796" delta="-34%">
          <SalesVsRefundsBars />
        </DashboardPanel>
      </div>

      <RefundReasonsCard />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Records</p>
              <h3 className="mt-2 text-xl font-semibold text-primary">Primary data table</h3>
            </div>
            <span className="inline-flex rounded-full bg-secondary_subtle px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-tertiary">
              {visibleRows} rows
            </span>
          </div>
          {columns.length > 0 ? <DataTable columns={columns} rows={records.data?.data ?? []} /> : <p className="m-0 text-sm text-secondary">No records available.</p>}
        </Card>

        <Card className="grid gap-4">
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Registry</p>
            <h3 className="mt-2 text-xl font-semibold text-primary">Registered models</h3>
          </div>
          <div className="grid gap-3">
            {models.data?.map((entry) => (
              <div key={entry.key} className="rounded-xl border border-secondary bg-secondary_subtle p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-primary">{entry.displayName}</strong>
                  <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                    {entry.recordCount}
                  </span>
                </div>
                <div className="mt-2 text-sm text-secondary">Records available for operational views.</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
