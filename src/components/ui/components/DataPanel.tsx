import { cn } from '../lib/cn';
import type { DataPanelProps } from '../models/dataPanelProps';
import type { ChildrenProps } from '../../../models/childrenProps';

import { Card } from './Card';

// One surface for a directory: filters, records, and paging share its edges.
// Background refreshes show a thin progress line and announce busyLabel.
export function DataPanel({
  toolbar,
  footer,
  busy = false,
  busyLabel,
  children,
  className,
}: DataPanelProps) {

  return (
    <Card
      aria-busy={busy}
      className={cn(
        'ui-data-panel relative grid min-w-0 overflow-hidden p-0 sm:p-0',
        className,
      )}
    >
      <span
        aria-hidden="true"
        data-active={busy || undefined}
        className="ui-progress-line"
      />
      <span role="status" aria-live="polite" className="sr-only">
        {busy ? busyLabel : ''}
      </span>
      {toolbar && (
        <div className="min-w-0 border-b-control border-secondary p-4 sm:px-6">
          {toolbar}
        </div>
      )}
      <div className="min-w-0">{children}</div>
      {footer && (
        <div className="min-w-0 border-t-control border-secondary px-4 py-3 sm:px-6">
          {footer}
        </div>
      )}
    </Card>
  );

}

// Centers loading or error feedback inside a DataPanel body.
export function DataPanelState({ children }: ChildrenProps) {

  return (
    <div className="grid min-h-64 place-items-center p-4 sm:p-6">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );

}
