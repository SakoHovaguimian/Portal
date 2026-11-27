import {
  DataPanel,
  DataTable,
  DescriptionList,
  Meter,
  MobileRecordRow,
  PageSection,
  type Column,
} from '@/components/ui';
import { strings } from '@/strings';

import type { SampleChannel } from './models/sampleChannel';

const copy = strings.ui.dashboardScreen;
const channels: SampleChannel[] = [
  { source: copy.githubComData, visitors: 2400, revenue: 3877, sales: 267 },
  { source: copy.facebook, visitors: 2200, revenue: 3426, sales: 249 },
  { source: copy.googleOrganic, visitors: 2000, revenue: 2444, sales: 224 },
  { source: copy.vimeoComData, visitors: 1900, revenue: 2236, sales: 220 },
  { source: copy.indiehackersComData, visitors: 1700, revenue: 2034, sales: 204 },
];

const countryShares = [
  { label: copy.unitedStates, value: 38 },
  { label: copy.italy, value: 28 },
  { label: copy.other, value: 34 },
];

const numberFormat = new Intl.NumberFormat('en-US');
const revenueFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const conversionFormat = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const numericAlignment = {
  headerClassName: 'text-end',
  cellClassName: 'text-end text-primary tabular-nums',
};
const channelMeasures: Column<SampleChannel>[] = [
  {
    key: 'visitors',
    header: copy.visitors,
    ...numericAlignment,
    render: (row) => numberFormat.format(row.visitors),
  },
  {
    key: 'revenue',
    header: copy.revenue,
    ...numericAlignment,
    render: (row) => revenueFormat.format(row.revenue),
  },
  {
    key: 'sales',
    header: copy.sales,
    ...numericAlignment,
    render: (row) => numberFormat.format(row.sales),
  },
  {
    key: 'conversion',
    header: copy.conversion,
    ...numericAlignment,
    render: (row) => conversionFormat.format(row.sales / row.visitors),
  },
];
const channelColumns: Column<SampleChannel>[] = [
  {
    key: 'source',
    header: copy.source,
    cellClassName: 'text-primary font-medium',
    render: (row) => row.source,
  },
  ...channelMeasures,
];

function renderMobileChannel(channel: SampleChannel) {

  const measures = channelMeasures.map((column) => ({
    label: column.header,
    value: column.render(channel),
  }));

  return (
    <MobileRecordRow title={channel.source}>
      <DescriptionList
        items={measures}
        layout="compact"
        className="text-end tabular-nums [&_dt]:justify-end"
      />
    </MobileRecordRow>
  );

}

function renderCountryShare({ label, value }: (typeof countryShares)[number]) {
  return <Meter key={label} label={label} value={value} size="sm" />;
}

export function SampleAnalytics() {

  const countryMeters = countryShares.map(renderCountryShare);

  return (
    <PageSection id="sample-analytics" title={copy.sampleAnalytics}>
      <DataPanel>
        <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_minmax(15rem,0.38fr)]">
          <section aria-labelledby="dashboard-channels-title" className="min-w-0">
            <h3 id="dashboard-channels-title" className="m-0 border-b-control border-secondary p-(--space-panel) text-base font-semibold text-primary">
              {copy.topChannels}
            </h3>
            <DataTable
              caption={copy.topChannels}
              rows={channels}
              columns={channelColumns}
              getRowKey={(row) => row.source}
              renderMobileRow={renderMobileChannel}
              embedded
            />
          </section>
          <section aria-labelledby="dashboard-country-title" className="grid min-w-0 content-start gap-4 border-t-control border-secondary bg-secondary_subtle p-(--space-panel) xl:border-s-control xl:border-t-0">
            <h3 id="dashboard-country-title" className="m-0 text-base font-semibold text-primary">{copy.countryShareTitle}</h3>
            {countryMeters}
          </section>
        </div>
      </DataPanel>
    </PageSection>
  );

}
