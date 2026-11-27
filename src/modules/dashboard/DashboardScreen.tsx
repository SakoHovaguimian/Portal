'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  ActivityIndicator,
  Button,
  Card,
  DataTable,
  MetricCard,
  ErrorState,
  PageHeader,
  SegmentedTabs,
} from '@/components/ui';
import { portalModules } from '@/config/portalModules';
import type { DashboardModelSummary } from '@/models/dashboardModelSummary';
import type { DashboardOverviewItem } from '@/models/dashboardOverviewItem';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { useDashboardChromeStore } from '../../stores/dashboardChromeStore';
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
    const keys = Object.keys(rows[0] ?? {}).slice(0, 4);
    const tableColumns = keys.map((key) => {

      const field = modelDetail.data?.fields.find(
        (candidate) => candidate.name === key,
      );
      const header = field?.displayName || key;

      function renderCellValue(row: Record<string, unknown>) {

        const cellValue = String(row[key] ?? '');
        return cellValue;

      }

      const column = {
        key,
        header,
        cellClassName: density === 'compact' ? 'py-1' : undefined,
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
            <Link href="/dev-settings/components">
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
          <Card>
            <ActivityIndicator label={strings.ui.dashboardScreen.loadingWorkspaceData} showLabel />
          </Card>
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

  function renderMetricCard(item: DashboardOverviewItem) {

    return (
      <MetricCard
        key={item.model}
        eyebrow={item.displayName}
        value={String(item.totalCount)}
        caption={strings.ui.dashboardScreen.newInRange(item.periodCount)}
      />
    );

  }

  function renderMetrics() {

    const metricCards = overview.data?.models.map(renderMetricCard);

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards}
      </div>
    );

  }

  function renderRecordsPanel() {

    const rows = records.data?.data ?? [];
    const hasTable = columns.length > 0;
    const title = modelDetail.data?.displayName ?? strings.ui.dashboardScreen.records;

    return (
      <Card className="grid content-start gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-xl font-semibold text-primary">{title}</h2>
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
          <DataTable columns={columns} rows={rows} caption={title} />
        ) : (!model || records.isSuccess) && (
          <p className="m-0 text-sm text-secondary">
            {strings.ui.dashboardScreen.noRecordsAvailableHint}
          </p>
        )}
      </Card>
    );

  }

  function renderModelEntry(entry: DashboardModelSummary) {

    return (
      <li key={entry.key}>
        <Link
          className="flex min-h-11 items-center justify-between gap-3 py-2 font-medium text-primary hover:underline aria-[current=page]:underline"
          href={`/dashboard?model=${encodeURIComponent(entry.key)}`}
          aria-current={entry.key === model ? 'page' : undefined}
        >
          <span>{entry.displayName}</span>
          <span className="text-sm text-secondary tabular-nums">
            {strings.ui.dashboardScreen.recordCount(entry.recordCount)}
          </span>
        </Link>
      </li>
    );

  }

  function renderRegistry() {

    const modelEntries = models.data?.map(renderModelEntry);

    return (
      <Card className="grid content-start gap-4">
        <h2 className="m-0 text-xl font-semibold text-primary">
          {strings.ui.dashboardScreen.registeredModels}
        </h2>
        <ul className="m-0 list-none divide-y-control divide-secondary p-0">{modelEntries}</ul>
      </Card>
    );

  }

  function renderRecordDirectory() {

    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {renderRecordsPanel()}
        {renderRegistry()}
      </div>
    );

  }

  function renderContent() {

    return (
      <div className="grid gap-6">
        {renderHeader()}
        {renderQueryStatus()}
        {renderMetrics()}
        {renderRecordDirectory()}
        {demoMode && hasSampleAnalyticsData && <SampleAnalytics />}
      </div>
    );

  }

  return renderContent();

}
