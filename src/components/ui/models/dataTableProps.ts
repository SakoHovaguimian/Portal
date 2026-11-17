import type { ReactNode } from 'react';

import type { Column } from './tableColumn';
import type { TableSelection } from './tableSelection';

interface DataTableBaseProps<T> {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
  getRowHref?: (row: T) => string | undefined;
  onRowNavigate?: (href: string) => void;
  renderMobileRow?: (row: T) => ReactNode;
  embedded?: boolean;
}

export type DataTableProps<T> = DataTableBaseProps<T> &
  (
    | { selection: TableSelection<T>; getRowKey: (row: T) => string }
    | { selection?: undefined; getRowKey?: (row: T) => string }
  );
