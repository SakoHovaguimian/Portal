'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceContainer } from '@/providers/AppProviders';

import type { EngagementKey } from './models/engagementKey';
import type { SavedQuery } from './models/savedQuery';
import { engagementQueryKeys } from './queryKeys';

export function useSavedItems(query: SavedQuery) {

  const { engagementService } = useServiceContainer();
  const savedItemsQuery = useQuery({
    queryKey: engagementQueryKeys.saved(query),
    queryFn: ({ signal }) => engagementService.saved(query, signal),
  });

  return savedItemsQuery;

}

export function useRemoveSavedItem() {

  const { engagementService } = useServiceContainer();
  const cache = useQueryClient();
  const removeSavedItemMutation = useMutation({
    mutationFn: (key: EngagementKey) => engagementService.removeSaved(key),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: engagementQueryKeys.all });
    },
  });

  return removeSavedItemMutation;

}
