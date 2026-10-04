'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, staleTimes, type UserMutationInput } from '@/models';
import { useServiceContainer } from '../../providers/AppProviders';
import { useSessionState } from '@/providers/AppProviders';
import { AppSessionSchema } from '@/models/auth';

export function useUsers(query = '') {
  const container = useServiceContainer();
  return useQuery({
    queryKey: queryKeys.users.list(query).queryKey,
    queryFn: () =>
      container.userService.listUsers({
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
    queryFn: () => container.userService.getUserById(userId),
    staleTime: staleTimes.users,
  });
}

export function useUpdateCurrentUser(userId: string) {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const { setSession } = useSessionState();

  return useMutation({
    mutationFn: async (input: UserMutationInput) => {
      const user = await container.userService.updateCurrentUser(userId, input);
      const response = await fetch('/api/auth/session', { method: 'PUT' });
      if (response.ok)
        setSession(AppSessionSchema.parse(await response.json()));

      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(userId).queryKey, user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
    },
  });
}
