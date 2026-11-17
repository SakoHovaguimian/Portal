import type { DirectoryFiltersValue } from './directoryFiltersValue';

export interface DirectoryMultiFiltersProps<Status extends string> {
  id: string;
  value: DirectoryFiltersValue<Status[]>;
  onChange: (value: { query: string; status: Status[] }) => void;
  statuses: readonly { value: Status; label: string }[];
  copy: {
    search: string;
    placeholder: string;
    clear: string;
    status: string;
    allStatuses: string;
    selected: (count: number) => string;
    clearStatuses: string;
  };
}
