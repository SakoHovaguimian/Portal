import type { Metadata } from 'next';

import { portal__Name__Strings } from '@/strings';

import { __Name__Editor } from '@/modules/__slug__/__Name__Editor';

export const metadata: Metadata = { title: portal__Name__Strings.createAction };

export default function CreateRecordPage() {
  return <__Name__Editor />;
}
