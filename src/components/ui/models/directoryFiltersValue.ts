import type { DirectoryStatus } from './directoryStatus';

export type DirectoryFiltersValue<Status extends DirectoryStatus> = {
  query: string;
  status?: Status;
};
