import type { Metadata } from 'next';

import type { IdRouteProps } from '@/models/idRouteProps';
import { portal__Name__Strings } from '@/strings';

import { __Name__DetailScreen } from '@/modules/__slug__/__Name__DetailScreen';

export const metadata: Metadata = { title: portal__Name__Strings.detailTitle };

export default async function RecordPage({ params }: IdRouteProps) {

  const { id } = await params;
  return <__Name__DetailScreen id={id} />;

}
