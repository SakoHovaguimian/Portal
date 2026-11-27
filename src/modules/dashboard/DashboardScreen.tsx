'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  Button,
  Card,
  DataPanel,
  DataTable,
  ErrorState,
  InlineLoading,
  Page,
  PageHeader,
  SegmentedTabs,
  UiIcon,
} from '@/components/ui';
import { cn } from '@/components/ui/lib/cn';
import { portalModules } from '@/config/portalModules';
import type { DashboardModelSummary } from '@/models/dashboardModelSummary';
import type { DashboardOverviewItem } from '@/models/dashboardOverviewItem';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { useDashboardChromeStore } from '@/stores/dashboardChromeStore';
import { strings } from '@/strings';

import {
  useDashboardOverview,
  useDashboardModels,
  useDashboardRecords,
  useDashboardModelDetail,
} from './hooks';
import { SampleAnalytics } from './SampleAnalytics';

const densityOptions = (['comfortable', 'compact'] as const).map((value) => ({
  value,
  label: strings.ui.dashboardScreen[value],
}));

const countFormat = new Intl.NumberFormat('en-US');
const timestampFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export function DashboardScreen() {

  const searchParams = useSearchParams();
  const { demoMode, devSettingsEnabled } = useRuntimeConfig();
  const fallbackModel = portalModules.featureRequests ? 'featureRequest' : portalModules.users ? 'user' : '';
  const requestedModel = searchParams.get('model') ?? fallbackModel;
  const model = (requestedModel === 'user' && !portalModules.users) || (requestedModel === 'featureRequest' && !portalModules.featureRequests) ? fallbackModel : requestedModel;
  const search = searchParams.get('search') ?? '';

  const overview = useDashboardOverview();
  const models = useDashboardModels();
  const records = useDashboardRecords(model, search);
  const modelDetail = useDashboardModelDetail(model);

  const { density, setDensity } = useDashboardChromeStore();

  const columns = useMemo(() => {

    const rows = records.data?.data ?? [];
    const recordKeys = Object.keys(rows[0] ?? {}).slice(0, 4);
    const labelKey = modelDetail.data?.labelField;
    const keys = labelKey && recordKeys.includes(labelKey)
      ? [labelKey, ...recordKeys.filter((key) => key !== labelKey)]
      : recordKeys;
    const tableColumns = keys.map((key) => {

      const field = modelDetail.data?.fields.find(
        (candidate) => candidate.name === key,
      );
      const header = field?.displayName || key;

      function renderCellValue(row: Record<string, unknown>) {

        const cellValue = String(row[key] ?? '');
        if (field?.type === 'date' && cellValue.includes('T')) {

          const timestamp = Date.parse(cellValue);
          if (Number.isFinite(timestamp)) {
            return <time dateTime={cellValue} title={cellValue}>{timestampFormat.format(timestamp)}</time>;
          }

        }
        return cellValue;

      }

      const column = {
        key,
        header,
        cellClassName: cn(
          'wrap-anywhere',
          density === 'compact' && 'py-1',
          field?.type === 'uuid' && 'font-mono text-xs',
          field?.type === 'date' && 'text-xs tabular-nums',
          key === labelKey && 'min-w-40 font-medium text-primary',
        ),
        render: renderCellValue,
      };

      return column;

    });

    return tableColumns;

  }, [records.data, modelDetail.data, density]);

  const hasSampleAnalyticsData = overview.data?.models.some(
    (item) => item.model === 'featureRequest' && item.totalCount > 0,
  );

  function renderHeader() {

    return (
      <PageHeader
        title={strings.ui.dashboardScreen.dashboard}
        description={strings.ui.dashboardScreen.description}
        meta={
          overview.data && (
            <span>
              {strings.ui.dashboardScreen.dateRange(
                new Date(overview.data.dateRange.from).toLocaleDateString(
                  'en-US',
                ),
                new Date(overview.data.dateRange.to).toLocaleDateString(
                  'en-US',
                ),
              )}
            </span>
          )
        }
        action={devSettingsEnabled && (
          <Button asChild variant="secondary">
            <Link href="/dev-settings#component-library">
              {strings.designSystem.openLibrary}
            </Link>
          </Button>
        )}
      />
    );

  }

  function renderQueryStatus() {

    return (
      <>
        {(overview.isPending || models.isPending || (Boolean(model) && records.isPending)) && (
          <InlineLoading message={strings.ui.dashboardScreen.loadingWorkspaceData} />
        )}
        {(overview.isError || models.isError || records.isError) && (
          <ErrorState
            title={strings.ui.dashboardScreen.workspaceDataUnavailable}
            description={
              strings.ui.dashboardScreen
                .pleaseTryLoadingYourWorkspaceAgainHint
            }
            onRetry={() => {

              void overview.refetch();
              void models.refetch();
              if (model) { void records.refetch(); }

            }}
          />
        )}
      </>
    );

  }

  function renderMetric(item: DashboardOverviewItem) {

    return (
      <div key={item.model} className="row-span-3 grid min-w-0 grid-rows-subgrid gap-2 p-4 sm:p-(--space-panel)">
        <dt className="text-sm font-medium text-secondary wrap-anywhere">{item.displayName}</dt>
        <dd className="m-0 text-3xl font-semibold tracking-tight text-primary tabular-nums">
          {countFormat.format(item.totalCount)}
        </dd>
        <dd className="m-0 text-xs text-secondary tabular-nums">
          {strings.ui.dashboardScreen.newInRange(item.periodCount)}
        </dd>
      </div>
    );

  }

  function renderMetrics() {

    if (!overview.data?.models.length) { return null; }
    const metrics = overview.data.models.map(renderMetric);

    return (
      <Card className="overflow-hidden border-brand/20 bg-brand-primary p-0 shadow-none">
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] divide-x-control divide-secondary">{metrics}</dl>
      </Card>
    );

  }

  function renderRecordsPanel() {

    const rows = records.data?.data ?? [];
    const hasTable = columns.length > 0;
    const title = modelDetail.data?.displayName ?? strings.ui.dashboardScreen.records;

    return (
      <section aria-labelledby="dashboard-records-title" className="grid min-w-0 content-start">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-control border-secondary p-(--space-panel)">
          <div>
            <h2 id="dashboard-records-title" className="m-0 text-lg font-semibold text-primary">{title}</h2>
            {hasTable && (
              <p className="m-0 mt-1 text-sm text-secondary">
                {strings.ui.dashboardScreen.visibleRecordCountSummary(rows.length)}
              </p>
            )}
          </div>
          {hasTable && (
            <SegmentedTabs
              label={strings.ui.dashboardScreen.density}
              value={density}
              onValueChange={setDensity}
              tabs={densityOptions}
            />
          )}
        </div>
        {hasTable ? (
          <DataTable embedded columns={columns} rows={rows} caption={title} />
        ) : (!model || records.isSuccess) && (
          <p className="m-0 p-(--space-panel) text-sm text-secondary">
            {strings.ui.dashboardScreen.noRecordsAvailableHint}
          </p>
        )}
      </section>
    );

  }

  function renderModelEntry(entry: DashboardModelSummary) {

    return (
      <li key={entry.key}>
        <Link
          className="flex h-full min-h-11 min-w-0 items-center justify-between gap-2 rounded-control px-3 py-2.5 text-sm font-medium text-secondary hover:bg-brand-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-[current=page]:bg-brand-primary aria-[current=page]:text-brand-secondary"
          href={`/dashboard?model=${encodeURIComponent(entry.key)}`}
          aria-current={entry.key === model ? 'page' : undefined}
        >
          <span className="min-w-0 wrap-anywhere">
            <span className="block">{entry.displayName}</span>
            <span className="block text-xs font-normal text-tertiary tabular-nums">
              {strings.ui.dashboardScreen.recordCount(entry.recordCount)}
            </span>
          </span>
          <UiIcon name="chevronRight" className="size-4 shrink-0" />
        </Link>
      </li>
    );

  }

  function renderRegistry() {

    const modelEntries = models.data?.map(renderModelEntry);

    return (
      <nav aria-labelledby="dashboard-models-title" className="grid min-w-0 content-start gap-2 border-b-control border-secondary bg-secondary_subtle p-3 xl:border-e-control xl:border-b-0">
        <h2 id="dashboard-models-title" className="m-0 px-3 py-2 text-xs font-semibold text-tertiary">
          {strings.ui.dashboardScreen.registeredModels}
        </h2>
        <ul className="m-0 grid list-none grid-cols-2 gap-1 p-0 xl:grid-cols-1">{modelEntries}</ul>
      </nav>
    );

  }

  function renderRecordDirectory() {

    return (
      <DataPanel>
        <div className="grid min-w-0 xl:grid-cols-[minmax(11rem,0.28fr)_minmax(0,1fr)]">
          {renderRegistry()}
          {renderRecordsPanel()}
        </div>
      </DataPanel>
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        {renderQueryStatus()}
        {renderMetrics()}
        {renderRecordDirectory()}
        {demoMode && hasSampleAnalyticsData && <SampleAnalytics />}
      </Page>
    );

  }

  return renderContent();

}
