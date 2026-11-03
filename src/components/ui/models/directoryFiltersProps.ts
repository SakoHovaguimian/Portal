import type { ReactNode } from 'react';
import type { DirectoryFiltersValue } from './directoryFiltersValue';

export interface DirectoryFiltersProps<Status extends string> {
  id: string;
  value: DirectoryFiltersValue<Status>;
  onChange: (value: DirectoryFiltersValue<Status>) => void;
  statuses: readonly { value: Status; label: string }[];
  additionalFilters?: ReactNode;
  showStatus?: boolean;
  layout?: 'inline' | 'stackedSearch';
  copy: {
    search: string;
    placeholder: string;
    clear: string;
    status: string;
    allStatuses: string;
  };
}
