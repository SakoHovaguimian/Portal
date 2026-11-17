import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { portalModules } from '@/config/portalModules';
import type { SearchRouteProps } from '@/models/searchRouteProps';
import { portalEngagementStrings as copy } from '@/strings';

import { SavedQuerySchema } from '@/modules/engagement/models/savedQuery';
import { SavedItemsScreen } from '@/modules/engagement/SavedItemsScreen';

export const metadata: Metadata = { title: copy.title };

export default async function Page({
  searchParams,
}: SearchRouteProps) {

  if (!portalModules.engagement) { notFound(); }
  const search = await searchParams;
  const single = (key: string) =>
    typeof search[key] === 'string' ? search[key] : undefined;
  const query = SavedQuerySchema.safeParse({
    query: single('query'),
    limit: single('limit'),
    offset: single('offset'),
  });
  return (
    <SavedItemsScreen
      query={query.success ? query.data : SavedQuerySchema.parse({})}
    />
  );

}
