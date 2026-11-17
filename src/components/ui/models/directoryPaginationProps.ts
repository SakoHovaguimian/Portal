import type { DirectoryPage } from './directoryPage';

export interface DirectoryPaginationProps {
  page: DirectoryPage;
  count: number;
  busy: boolean;
  label: string;
  range: (from: number, to: number) => string;
  onNavigate: (offset: number) => void;
}
