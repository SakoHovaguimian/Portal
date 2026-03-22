import { QueryClient } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { queryKeys } from '@semantic-web/core';
import { getAppearancePageData } from '../controllers/appearanceController';
import { getDashboardPageData, getDashboardRecordsPageData } from '../controllers/dashboardController';
import { getFeatureRequestDetailPageData, getFeatureRequestsPageData } from '../controllers/featureRequestsController';
import { getProfilePageData, getUserDetailPageData, getUsersPageData } from '../controllers/usersController';
import { getServerSession } from '../lib/server/getServerSession';
import { createServerServiceContainer } from '../lib/server/container';

export async function composeUsersPage(searchParams?: Record<string, string | string[] | undefined>) {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list(String(searchParams?.query ?? '')).queryKey,
    queryFn: () => getUsersPageData(container, searchParams),
  });
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeUserDetailPage(userId: string) {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(userId).queryKey,
    queryFn: () => getUserDetailPageData(container, userId),
  });
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeProfilePage() {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  if (session) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(session.user.id).queryKey,
      queryFn: () => getProfilePageData(container),
    });
  }
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeFeatureRequestsPage(searchParams?: Record<string, string | string[] | undefined>) {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.featureRequests.list(String(searchParams?.query ?? '')).queryKey,
    queryFn: () => getFeatureRequestsPageData(container, searchParams),
  });
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeFeatureRequestDetailPage(featureRequestId: string) {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.featureRequests.detail(featureRequestId).queryKey,
    queryFn: () => getFeatureRequestDetailPageData(container, featureRequestId),
  });
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeDashboardPage(searchParams?: Record<string, string | string[] | undefined>) {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.overview.queryKey,
      queryFn: () => getDashboardPageData(container).then((value) => value.overview),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.models.queryKey,
      queryFn: () => getDashboardPageData(container).then((value) => value.models),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.records(String(searchParams?.model ?? 'featureRequest'), String(searchParams?.search ?? '')).queryKey,
      queryFn: () => getDashboardRecordsPageData(container, searchParams),
    }),
  ]);
  return { session, dehydratedState: dehydrate(queryClient) };
}

export async function composeAppearancePage() {
  const session = await getServerSession();
  const container = createServerServiceContainer(session);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.appearance.preference.queryKey,
    queryFn: () => getAppearancePageData(container),
  });
  return { session, dehydratedState: dehydrate(queryClient) };
}
