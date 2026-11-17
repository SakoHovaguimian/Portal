import type { DetailItem } from './detailItem';

export interface DescriptionListProps {
  items: DetailItem[];
  layout?: 'grid' | 'rows' | 'compact';
  className?: string;
}
