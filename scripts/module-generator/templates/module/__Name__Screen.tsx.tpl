'use client';

import Link from 'next/link';

import { Button, DataPanel, DataTable, DirectoryFilters, DirectoryPagination, EmptyState, MobileRecordRow, Page, PageHeader, QueryBoundary } from '@/components/ui';
import type { PaginatedResult } from '@/models/paginatedResult';
import { useDirectoryState } from '@/queries/useDirectoryState';
import { portalActionStrings, portal__Name__Strings as copy, strings } from '@/strings';

import { use__Name__List } from './hooks';
import type { __Name__Record } from './models/__key__Record';

export function __Name__Screen() {

  const directory = useDirectoryState();
  const query = use__Name__List(directory.query, directory.offset);

  function renderFilters() {

    return (
      <DirectoryFilters
        id="__slug__-search"
        value={{ query: directory.query }}
        statuses={[]}
        showStatus={false}
        onChange={({ query: search }) => directory.update({ query: search || undefined, offset: undefined })}
        copy={{
          search: copy.searchLabel, placeholder: copy.searchPlaceholder, clear: portalActionStrings.clearSearch,
          status: strings.directory.status, allStatuses: strings.directory.allStatuses,
        }}
      />
    );

  }

  function renderName(row: __Name__Record) {
    return <Link className="font-medium text-primary hover:text-brand-secondary" href={`/__slug__/${row.id}`}>{row.name}</Link>;
  }

  function renderUpdated(row: __Name__Record) {
    return <time dateTime={row.updatedAt}>{new Date(row.updatedAt).toLocaleString()}</time>;
  }

  function renderMobileRow(row: __Name__Record) {
    return <MobileRecordRow title={renderName(row)} footer={renderUpdated(row)} />;
  }

  function renderRecords(page: PaginatedResult<__Name__Record>) {

    if (!page.data.length) {

      const filtered = Boolean(directory.query || directory.offset);
      return <EmptyState variant="plain" title={filtered ? copy.noResultsTitle : copy.emptyTitle} description={filtered ? copy.noResultsHint : copy.emptyHint} />;

    }
    return (
      <DataTable
        embedded
        caption={copy.title}
        rows={page.data}
        getRowKey={(row) => row.id}
        getRowHref={(row) => `/__slug__/${row.id}`}
        renderMobileRow={renderMobileRow}
        columns={[
          { key: 'name', header: copy.nameLabel, render: renderName },
          { key: 'updatedAt', header: copy.updatedColumn, render: renderUpdated },
        ]}
      />
    );

  }

  function renderPagination() {

    if (!query.data || query.isError) { return null; }
    const { data, limit, offset, total } = query.data;
    const next = offset + limit;
    return (
      <DirectoryPagination
        page={{ limit, offset, hasMore: next < total, nextOffset: next < total ? next : null }}
        count={data.length}
        busy={query.isFetching}
        range={strings.designSystem.recordRange}
        label={copy.paginationLabel}
        onNavigate={directory.setOffset}
      />
    );

  }

  return (
    <Page>
      <PageHeader title={copy.title} action={<Button asChild><Link href="/__slug__/new">{copy.createAction}</Link></Button>} />
      <DataPanel toolbar={renderFilters()} footer={renderPagination()} busy={query.isFetching} busyLabel={strings.common.loading}>
        <QueryBoundary query={query} inset>{renderRecords}</QueryBoundary>
      </DataPanel>
    </Page>
  );

}
