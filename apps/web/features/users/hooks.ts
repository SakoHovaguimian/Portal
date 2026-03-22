'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, staleTimes, type UserMutationInput } from '@semantic-web/core';
import { useServiceContainer } from '../../providers/AppProviders';
import { appEnv } from '../../lib/auth/env';

export function useUsers(query = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.users.list(query).queryKey,
    queryFn: () =>
      container.services.userService.listUsers({
        query,
        limit: 25,
        offset: 0,
      }),
    staleTime: staleTimes.users,
  });
}

export function useUser(userId: string) {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.users.detail(userId).queryKey,
    queryFn: () => container.services.userService.getUserById(userId),
    staleTime: staleTimes.users,
  });
}

export function useUpdateCurrentUser(userId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UserMutationInput) => {
      const user = await container.services.userService.updateCurrentUser(userId, input);
      if (!appEnv.enableMockAuth) {
        await fetch('/api/auth/session', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        });
      }

      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(userId).queryKey, user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
    },
  });
}
