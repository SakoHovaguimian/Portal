'use client';

import { portalPublishingStrings } from '@/strings';
import { DirectoryPagination } from '@/components/ui';
import type { BlogPaginationProps } from '../models/blogPaginationProps';

const copy = portalPublishingStrings.article;

export function BlogPagination({
  page,
  busy = false,
  onNavigateAction,
}: BlogPaginationProps) {

  const hasMore = page.offset + page.data.length < page.total;
  return (
    <DirectoryPagination
      count={page.data.length}
      busy={busy}
      label={copy.paginationLabel}
      page={{
        limit: page.limit,
        offset: page.offset,
        hasMore,
        nextOffset: hasMore ? page.offset + page.limit : null,
      }}
      range={(from, to) => copy.articleRange(from, to, page.total)}
      onNavigate={onNavigateAction}
    />
  );

}
