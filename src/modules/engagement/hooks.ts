'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServiceContainer } from '@/providers/AppProviders';
import type { SavedQuery } from './models/savedQuery';
import type { EngagementKey } from './models/engagementTarget';
import { engagementQueryKeys } from './queryKeys';
export function useSavedItems(query: SavedQuery) {
  const { engagementService } = useServiceContainer();
  return useQuery({
    queryKey: engagementQueryKeys.saved(query),
    queryFn: ({ signal }) => engagementService.saved(query, signal),
  });
}
export function useRemoveSavedItem() {
  const { engagementService } = useServiceContainer();
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (key: EngagementKey) => engagementService.removeSaved(key),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: engagementQueryKeys.all });
    },
  });
}
