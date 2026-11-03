'use client';

import { componentExpansionStrings as copy } from '@/strings';
import type { BulkActionBarProps } from '../models/bulkActionBarProps';
import { Button } from './Button';

export function BulkActionBar({
  selectedCount,
  totalCount,
  scope = 'page',
  onSelectAllResults,
  onClear,
  busy,
  children,
  error,
}: BulkActionBarProps) {
  return (
    <div className="grid min-w-0 gap-2 rounded-control border-control border-secondary bg-secondary_subtle p-3">
      <div className="flex min-h-11 flex-wrap items-center gap-3">
        <p
          role="status"
          className="m-0 min-w-0 flex-1 basis-40 text-sm font-medium text-secondary"
        >
          {scope === 'all'
            ? copy.table.allSelected(selectedCount)
            : copy.table.selected(selectedCount)}
        </p>
        {selectedCount > 0 && (
          <>
            {scope !== 'all' &&
              totalCount !== undefined &&
              totalCount > selectedCount &&
              onSelectAllResults && (
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={onSelectAllResults}
                >
                  {copy.table.selectMatching(totalCount)}
                </Button>
              )}
            <Button variant="ghost" disabled={busy} onClick={onClear}>
              {copy.table.clear}
            </Button>
          </>
        )}
        <fieldset
          disabled={busy || selectedCount === 0}
          aria-busy={busy}
          aria-label={copy.table.actions}
          className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0"
        >
          {children}
        </fieldset>
      </div>
      {error && (
        <p role="alert" className="m-0 text-sm text-error-primary">
          {error}
        </p>
      )}
    </div>
  );
}
