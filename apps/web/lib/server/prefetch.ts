import { dehydrate, type QueryClient } from '@tanstack/react-query';

export async function prefetchQuery<T>(queryClient: QueryClient, key: readonly unknown[], fn: () => Promise<T>) {
  await queryClient.prefetchQuery({ queryKey: [...key], queryFn: fn });
  return dehydrate(queryClient);
}
