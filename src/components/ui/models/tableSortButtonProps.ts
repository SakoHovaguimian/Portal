import type { Column } from './tableColumn';

export interface TableSortButtonProps {
  header: string;
  sort: NonNullable<Column<unknown>['sort']>;
}
