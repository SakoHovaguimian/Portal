import { useEffect } from 'react';

import { DirectoryPagination } from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

import type { AccountToolsPaginationProps } from '../models/accountToolsPaginationProps';

export function AccountToolsPagination({
  page,
  count,
  busy,
  onNavigate,
}: AccountToolsPaginationProps) {

  useEffect(() => {

    if (!busy && count === 0 && page.offset > 0) { onNavigate(0); }

  }, [busy, count, page.offset, onNavigate]);
  return (
    <DirectoryPagination
      page={page}
      count={count}
      busy={busy}
      label={copy.common.paginationLabel}
      range={copy.common.rangeLabel}
      onNavigate={onNavigate}
    />
  );

}
