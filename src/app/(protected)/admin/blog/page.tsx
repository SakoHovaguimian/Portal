import type { Metadata } from 'next';
import { AdminBlogScreen } from '@/modules/blog/AdminBlogScreen';
import { blogQueryFromSearch } from '@/modules/blog/models/blogQuery';
import { portalPublishingStrings } from '@/strings';
export const metadata: Metadata = {
  title: portalPublishingStrings.article.adminTitle,
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <AdminBlogScreen query={blogQueryFromSearch(await searchParams, 10)} />
  );
}
