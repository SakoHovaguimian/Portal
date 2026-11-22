'use client';

import { QueryBoundary } from '@/components/ui';

import { use__Name__Record } from './hooks';
import type { __Name__DetailScreenProps } from './models/__key__DetailScreenProps';
import { __Name__Editor } from './__Name__Editor';

export function __Name__DetailScreen({ id }: __Name__DetailScreenProps) {

  const query = use__Name__Record(id);
  return (
    <QueryBoundary query={query} retainDataOnError>
      {(record) => <__Name__Editor key={record.id} record={record} />}
    </QueryBoundary>
  );

}
