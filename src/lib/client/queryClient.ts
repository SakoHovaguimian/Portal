import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry(failureCount, error) {
          const status = (error as { status?: number })?.status;
          if (status && [401, 403, 404].includes(status)) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });
}
