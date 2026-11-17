import { createQueryKeyStore } from '@lukemorales/query-key-factory';

/**
 * Typed query key store for React Query.
 *
 * This provides compile-time safety for query keys, preventing typos and
 * enabling IDE autocomplete. All query keys should be defined here.
 *
 * @example
 * // In a hook:
 * useQuery({
 *   queryKey: queryKeys.users.detail(userId).queryKey,
 *   queryFn: () => fetchUser(userId),
 * });
 *
 * @example
 * // For invalidation:
 * queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
 */
export const queryKeys = createQueryKeyStore({
  auth: {
    session: null,
  },
  users: {
    all: null,
    list: (query: string) => [query],
    detail: (userId: string) => [userId],
  },
  featureRequests: {
    all: null,
    list: (query: string) => [query],
    detail: (featureRequestId: string) => [featureRequestId],
  },
  dashboard: {
    overview: null,
    models: null,
    modelDetail: (modelKey: string) => [modelKey],
    records: (modelKey: string, search: string) => [modelKey, search],
  },
  appearance: {
    preference: null,
  },
});

/**
 * Stale time configuration for different query types.
 * Values are in milliseconds.
 */
export const staleTimes = {
  authSession: 1000 * 60 * 5, // 5 minutes
  users: 1000 * 60, // 1 minute
  featureRequests: 1000 * 30, // 30 seconds
  dashboard: 1000 * 15, // 15 seconds
} as const;
