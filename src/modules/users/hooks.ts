'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys, staleTimes, type UserMutationInput } from '@/models';
import { AppSessionSchema } from '@/models/auth';
import {
  useServiceContainer,
  useSessionState,
} from '../../providers/AppProviders';

export function useUsers(query = '') {

  const container = useServiceContainer();
  const usersQuery = useQuery({
    queryKey: queryKeys.users.list(query).queryKey,
    queryFn: ({ signal }) =>
      container.userService.listUsers(
        {
          query,
          limit: 25,
          offset: 0,
        },
        signal,
      ),
    staleTime: staleTimes.users,
  });

  return usersQuery;

}

export function useUser(userId: string) {

  const container = useServiceContainer();
  const userQuery = useQuery({
    queryKey: queryKeys.users.detail(userId).queryKey,
    queryFn: ({ signal }) => container.userService.getUserById(userId, signal),
    enabled: Boolean(userId),
    staleTime: staleTimes.users,
  });

  return userQuery;

}

export function useUpdateCurrentUser(userId: string) {

  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const { setSession } = useSessionState();
  const updateCurrentUserMutation = useMutation({
    mutationFn: async (input: UserMutationInput) => {

      const user = await container.userService.updateCurrentUser(userId, input);
      const response = await fetch('/api/auth/session', { method: 'PUT' });
      if (response.ok) {
        setSession(AppSessionSchema.parse(await response.json()));
      }

      return user;

    },
    onSuccess: (user) => {

      queryClient.setQueryData(queryKeys.users.detail(userId).queryKey, user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users._def });

    },
  });

  return updateCurrentUserMutation;

}
