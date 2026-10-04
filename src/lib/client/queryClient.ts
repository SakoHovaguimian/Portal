import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
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
