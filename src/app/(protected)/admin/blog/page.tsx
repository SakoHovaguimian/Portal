import type { Metadata } from 'next';

import type { SearchRouteProps } from '@/models/searchRouteProps';
import { portalPublishingStrings } from '@/strings';

import { AdminBlogScreen } from '@/modules/blog/AdminBlogScreen';
import { blogQueryFromSearch } from '@/modules/blog/models/blogQuery';

export const metadata: Metadata = {
  title: portalPublishingStrings.article.adminTitle,
};

export default async function Page({
  searchParams,
}: SearchRouteProps) {

  return (
    <AdminBlogScreen query={blogQueryFromSearch(await searchParams, 10)} />
  );

}
