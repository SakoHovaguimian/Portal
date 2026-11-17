import type { Metadata } from 'next';

import type { IdRouteProps } from '@/models/idRouteProps';
import { portalPublishingStrings } from '@/strings';

import { BlogEditorScreen } from '@/modules/blog/BlogEditorScreen';

export const metadata: Metadata = {
  title: portalPublishingStrings.article.editTitle,
};

export default async function Page({
  params,
}: IdRouteProps) {
  return <BlogEditorScreen articleId={(await params).id} />;
}
