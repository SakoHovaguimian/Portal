'use client';

import { useRef } from 'react';
import {
  Button,
  DataPanel,
  DataTable,
  DescriptionList,
  DirectoryFilters,
  EmptyState,
  MobileRecordRow,
  Page,
  PageHeader,
  QueryBoundary,
} from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useDirectoryState } from '@/queries/useDirectoryState';
import { MutationError } from '@/components/MutationError';
import { portalAccountToolsStrings as copy } from '@/strings';
import type { AccountDevice } from './models/accountDevice';
import { AccountDeviceTypeSchema } from './models/accountDeviceType';
import { useAccountDevices, useRemoveAccountDevice } from './hooks';
import { AccountToolsLoading } from './components/AccountToolsLoading';
import { AccountToolsPagination } from './components/AccountToolsPagination';
import { formatAccountToolsDate } from './formatAccountToolsDate';

export function DevicesScreen() {

  const directory = useDirectoryState();
  const deviceType = AccountDeviceTypeSchema.safeParse(directory.status);
  const query = useAccountDevices({
    query: directory.query.slice(0, 200),
    deviceType: deviceType.success ? deviceType.data : undefined,
    limit: 20,
    offset: directory.offset,
  });
  const remove = useRemoveAccountDevice();
  const busy = useRef(false);
  const presentation = usePresentationService();
  const filtered = Boolean(directory.query || directory.status);
  const deviceStatusOptions = Object.entries(copy.devices.types).map(
    ([value, label]) => ({ value, label }),
  );

  async function removeDevice(device: AccountDevice) {

    if (busy.current) { return; }
    busy.current = true;
    try {

      const confirmed = await presentation.showAlert({
        title: copy.devices.removeTitle,
        description: copy.devices.removeDescription(
          copy.devices.types[device.deviceType],
          formatAccountToolsDate(device.createdAt),
          device.id,
        ),
        tone: 'danger',
        confirmLabel: copy.devices.removeAction,
        cancelLabel: copy.common.cancelAction,
      });
      if (!confirmed) { return; }
      await remove.mutateAsync(device.id);
      if (query.data?.data.length === 1 && directory.offset) { directory.setOffset(Math.max(0, directory.offset - 20)); }
      void presentation.showToast({
        title: copy.devices.removedTitle,
        intent: 'success',
      });

    } catch {
      /* The record and inline error remain available for retry. */
    } finally {
      busy.current = false;
    }

  }

  function renderHeader() {

    return (
      <PageHeader
        title={copy.devices.title}
        description={copy.devices.description}
        eyebrow={copy.common.accountEyebrow}
      />
    );

  }

  function renderFilters() {

    return (
      <DirectoryFilters
        id="devices-search"
        value={{
          query: directory.query,
          status: deviceType.success ? deviceType.data : undefined,
        }}
        onChange={(value) =>
          directory.update({
            query: value.query || undefined,
            status: value.status,
            offset: undefined,
          })
        }
        statuses={deviceStatusOptions}
        copy={{
          search: copy.devices.searchLabel,
          placeholder: copy.devices.searchPlaceholder,
          clear: copy.common.clearAction,
          status: copy.devices.typeLabel,
          allStatuses: copy.devices.allTypes,
        }}
      />
    );

  }

  function renderDeviceType(device: AccountDevice) {

    return (
      <span className="grid gap-1">
        <span className="font-medium text-primary">
          {copy.devices.types[device.deviceType]}
        </span>
        <span className="font-mono text-xs text-tertiary wrap-anywhere">
          {device.id}
        </span>
      </span>
    );

  }

  function renderRemoveAction(device: AccountDevice) {

    return (
      <Button
        variant="destructive"
        disabled={remove.isPending}
        onClick={() => void removeDevice(device)}
      >
        {copy.devices.removeAction}
      </Button>
    );

  }

  function renderMobileDevice(device: AccountDevice) {

    return (
      <MobileRecordRow
        title={copy.devices.types[device.deviceType]}
        description={device.id}
        summary={
          <DescriptionList
            items={[
              {
                label: copy.devices.registeredColumn,
                value: formatAccountToolsDate(device.createdAt),
              },
              {
                label: copy.common.updatedColumn,
                value: formatAccountToolsDate(device.updatedAt),
              },
            ]}
          />
        }
        footer={renderRemoveAction(device)}
      />
    );

  }

  function renderEmptyState() {

    return (
      <EmptyState
        variant="plain"
        title={filtered ? copy.common.noResultsTitle : copy.devices.emptyTitle}
        description={
          filtered ? copy.common.noResultsHint : copy.devices.emptyHint
        }
        action={
          filtered && (
            <Button
              variant="secondary"
              onClick={() =>
                directory.update({
                  query: undefined,
                  status: undefined,
                  offset: undefined,
                })
              }
            >
              {copy.common.clearFiltersAction}
            </Button>
          )
        }
      />
    );

  }

  function renderDeviceResults(result: NonNullable<typeof query.data>) {

    if (!result.data.length) { return renderEmptyState(); }
    return (
      <DataTable
        embedded
        caption={copy.devices.title}
        rows={result.data}
        getRowKey={(device) => device.id}
        columns={[
          {
            key: 'type',
            header: copy.devices.typeLabel,
            render: renderDeviceType,
          },
          {
            key: 'registered',
            header: copy.devices.registeredColumn,
            render: (device) => formatAccountToolsDate(device.createdAt),
          },
          {
            key: 'updated',
            header: copy.common.updatedColumn,
            render: (device) => formatAccountToolsDate(device.updatedAt),
          },
          {
            key: 'actions',
            header: copy.common.actionsColumn,
            render: renderRemoveAction,
          },
        ]}
        renderMobileRow={renderMobileDevice}
      />
    );

  }

  function renderQueryResults() {

    return (
      <QueryBoundary
        query={query}
        loadingFallback={<AccountToolsLoading />}
        inset
      >
        {(result) => renderDeviceResults(result)}
      </QueryBoundary>
    );

  }

  function renderFooter() {

    if (!query.data) { return undefined; }
    return (
      <AccountToolsPagination
        page={query.data.page}
        count={query.data.data.length}
        busy={query.isFetching}
        onNavigate={directory.setOffset}
      />
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        <MutationError error={remove.error} />
        <DataPanel
          busy={query.isFetching}
          busyLabel={copy.common.loadingTitle}
          toolbar={renderFilters()}
          footer={renderFooter()}
        >
          {renderQueryResults()}
        </DataPanel>
      </Page>
    );

  }

  return renderContent();

}
