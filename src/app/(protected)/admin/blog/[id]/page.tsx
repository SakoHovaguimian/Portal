import type { Metadata } from 'next';
import { BlogEditorScreen } from '@/modules/blog/BlogEditorScreen';
import { portalPublishingStrings } from '@/strings';
export const metadata: Metadata = {
  title: portalPublishingStrings.article.editTitle,
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BlogEditorScreen articleId={(await params).id} />;
}
