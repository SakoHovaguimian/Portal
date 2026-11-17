import type { DirectoryPage } from '@/components/ui';

export interface AccountToolsPaginationProps {
  page: DirectoryPage;
  count: number;
  busy: boolean;
  onNavigate: (offset: number) => void;
}
