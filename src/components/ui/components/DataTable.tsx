import type { TableSortButtonProps } from '../models/tableSortButtonProps';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { UiIcon } from './UiIcon';
import { strings } from '@/strings';
import { TableRowLink } from './TableRowLink';
import styles from './DataTable.module.css';
import type { DataTableProps } from '../models/dataTableProps';
import { TableSelectionCheckbox } from './TableSelectionCheckbox';
import { componentExpansionStrings } from '@/strings';

export type { Column } from '../models/tableColumn';

function TableSortButton({
  header,
  sort,
}: TableSortButtonProps) {

  return (
    <Button
      variant="ghost"
      className="-mx-2 min-h-(--control-height-md) shrink-0 gap-2 px-2 py-1 text-xs font-medium whitespace-nowrap"
      aria-label={sort.label}
      onClick={sort.onSort}
    >
      {header}
      <UiIcon
        name="arrowUp"
        className={cn(
          'size-4',
          sort.direction === 'desc' && 'rotate-180',
          !sort.direction && 'opacity-40',
        )}
      />
    </Button>
  );

}

export function DataTable<T>({
  columns,
  rows,
  caption = strings.componentLibrary.tableCaption,
  getRowKey,
  getRowHref,
  onRowNavigate,
  renderMobileRow,
  embedded = false,
  selection,
}: DataTableProps<T>) {

  const rowKey = (row: T, index: number) => getRowKey?.(row) ?? String(index);
  const enabledKeys = rows.flatMap((row, index) =>
    selection?.isRowDisabled?.(row) ? [] : [rowKey(row, index)],
  );
  const selected = new Set(selection?.selectedKeys ?? []);
  const pageSelected = enabledKeys.filter((key) => selected.has(key)).length;
  const toggleRow = (key: string, checked: boolean) => {

    const next = new Set(selected);
    if (checked) { next.add(key); } else { next.delete(key); }
    selection?.onSelectionChange([...next]);

  };
  const togglePage = (checked: boolean) => {

    const next = new Set(selected);
    enabledKeys.forEach((key) => {

      if (checked) { next.add(key); } else { next.delete(key); }

    });
    selection?.onSelectionChange([...next]);

  };
  const pageCheckbox = selection && (
    <TableSelectionCheckbox
      label={componentExpansionStrings.table.selectPage}
      checked={enabledKeys.length > 0 && pageSelected === enabledKeys.length}
      indeterminate={pageSelected > 0 && pageSelected < enabledKeys.length}
      disabled={selection.disabled || enabledKeys.length === 0}
      onChange={togglePage}
    />
  );

  function renderMobileSelection() {

    return (
      renderMobileRow && selection && (
        <div className="border-b-control border-secondary px-4 py-2 md:hidden">
          {pageCheckbox}
        </div>
      )
    );

  }

  function renderMobileSort() {

    if (!(renderMobileRow && columns.some((column) => column.sort))) {
      return null;
    }

    function renderMobileSortControl(column: (typeof columns)[number]) {

      return (column.sort ? (
        <TableSortButton
          key={column.key}
          header={column.header}
          sort={column.sort}
        />
      ) : null);

    }

    const sortControls = columns.map(renderMobileSortControl);

    return (
      <div
        role="group"
        aria-label={strings.ui.dataTable.sortColumns}
        tabIndex={0}
        className="flex min-w-0 flex-nowrap items-center gap-6 overflow-x-auto overscroll-x-contain border-b-control border-secondary px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:hidden"
      >
        {sortControls}
      </div>
    );

  }

  function renderMobileRecords() {

    if (!renderMobileRow) {
      return null;
    }

    const renderMobileRecord = renderMobileRow;

    function renderMobileRecordRow(row: T, index: number) {

      const href = getRowHref?.(row);
      return (
        <li
          key={getRowKey?.(row) ?? index}
          className={cn(
            href && styles.surface,
            href &&
              'cursor-pointer hover:bg-secondary_subtle has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-brand',
          )}
        >
          <div className={href ? styles.content : 'contents'}>
            {selection && (
              <div className="relative z-20 px-4 pt-3">
                <TableSelectionCheckbox
                  label={selection.getRowLabel(row)}
                  checked={selected.has(rowKey(row, index))}
                  disabled={
                    selection.disabled || selection.isRowDisabled?.(row)
                  }
                  onChange={(checked) =>
                    toggleRow(rowKey(row, index), checked)
                  }
                />
              </div>
            )}
            {renderMobileRecord(row)}
          </div>
          {href && (
            <TableRowLink href={href} onNavigate={onRowNavigate} />
          )}
        </li>
      );

    }

    const mobileRecordRows = rows.map(renderMobileRecordRow);

    return (
      <ul
        aria-label={caption}
        className={cn(
          'm-0 grid list-none p-0 md:hidden',
          embedded
            ? 'divide-y-control divide-secondary [&_.ui-section-card]:rounded-none [&_.ui-section-card]:border-0 [&_.ui-section-card]:shadow-none'
            : 'gap-3',
        )}
      >
        {mobileRecordRows}
      </ul>
    );

  }

  function renderDesktopTable() {

    function renderColumnHeader(column: (typeof columns)[number]) {

      return (
        <th
          key={column.key}
          scope="col"
          aria-sort={
            column.sort?.direction === 'asc'
              ? 'ascending'
              : column.sort?.direction === 'desc'
                ? 'descending'
                : undefined
          }
          className={cn(
            'px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-tertiary first:ps-6 last:pe-6',
            column.headerClassName,
          )}
        >
          {column.sort ? (
            <TableSortButton
              header={column.header}
              sort={column.sort}
            />
          ) : (
            column.header
          )}
        </th>
      );

    }

    const columnHeaders = columns.map(renderColumnHeader);

    function renderTableRow(row: T, index: number) {

      const href = getRowHref?.(row);

      function renderCell(column: (typeof columns)[number]) {

        return (
          <td
            key={column.key}
            className={cn(
              'px-4 py-3 align-middle text-sm text-secondary first:ps-6 last:pe-6',
              column.cellClassName,
              href && styles.surface,
            )}
          >
            <div className={href ? styles.content : 'contents'}>
              {column.render(row)}
            </div>
            {href && (
              <TableRowLink
                href={href}
                onNavigate={onRowNavigate}
              />
            )}
          </td>
        );

      }

      function renderCells() {

        const cells = columns.map(renderCell);
        return cells;

      }

      return (
        <tr
          key={getRowKey?.(row) ?? index}
          className={cn(
            'ui-table-row hover:bg-secondary_subtle',
            selection &&
              selected.has(rowKey(row, index)) &&
              'bg-brand-primary',
            href &&
              'cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-brand',
          )}
        >
          {selection && (
            <td className="relative z-20 w-14 px-4 py-3">
              <TableSelectionCheckbox
                label={selection.getRowLabel(row)}
                checked={selected.has(rowKey(row, index))}
                disabled={
                  selection.disabled || selection.isRowDisabled?.(row)
                }
                onChange={(checked) =>
                  toggleRow(rowKey(row, index), checked)
                }
              />
            </td>
          )}
          {renderCells()}
        </tr>
      );

    }

    const tableRows = rows.map(renderTableRow);

    return (
      <div
        className={cn(
          !embedded &&
            'overflow-hidden rounded-card border-control border-secondary bg-primary',
          renderMobileRow && 'hidden md:block',
        )}
      >
        <div
          className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          tabIndex={0}
          role="region"
          aria-label={caption}
        >
          <table className="min-w-full divide-y-control divide-secondary">
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-secondary_subtle">
              <tr>
                {selection && (
                  <th scope="col" className="w-14 px-4 py-3">
                    {pageCheckbox}
                  </th>
                )}
                {columnHeaders}
              </tr>
            </thead>
            <tbody className="divide-y-control divide-secondary bg-primary">
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>
    );

  }

  return (
    <>
      {renderMobileSelection()}
      {renderMobileSort()}
      {renderMobileRecords()}
      {renderDesktopTable()}
    </>
  );

}
