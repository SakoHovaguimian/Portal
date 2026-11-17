'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceContainer } from '@/providers/AppProviders';

import type { BlogPublicationMutationVariables } from './models/blogPublicationMutationVariables';
import type { BlogQuery } from './models/blogQuery';
import type { BlogRemoveMutationVariables } from './models/blogRemoveMutationVariables';
import type { BlogSaveMutationVariables } from './models/blogSaveMutationVariables';
import { blogQueryKeys } from './queryKeys';
import { engagementQueryKeys } from '@/modules/engagement/queryKeys';

export function useBlogOptions() {

  const { blogService } = useServiceContainer();
  const optionsQuery = useQuery({
    queryKey: blogQueryKeys.options,
    queryFn: ({ signal }) => blogService.options(false, signal),
  });

  return optionsQuery;

}

export function useBlogArticles(query: BlogQuery) {

  const { blogService } = useServiceContainer();
  const articlesQuery = useQuery({
    queryKey: blogQueryKeys.list(query),
    queryFn: ({ signal }) => blogService.list(query, signal),
    staleTime: 15000,
  });

  return articlesQuery;

}

export function useBlogArticle(id?: string) {

  const { blogService } = useServiceContainer();
  const articleQuery = useQuery({
    queryKey: blogQueryKeys.detail(id),
    queryFn: ({ signal }) => blogService.get(id!, signal),
    enabled: Boolean(id),
  });

  return articleQuery;

}

export function useBlogMutations() {

  const { blogService } = useServiceContainer();
  const queryClient = useQueryClient();
  const refresh = () => {

    void queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    void queryClient.invalidateQueries({ queryKey: engagementQueryKeys.all });

  };
  const save = useMutation({
    mutationFn: ({ id, input }: BlogSaveMutationVariables) =>
      id ? blogService.update(id, input) : blogService.create(input),
    onSuccess: refresh,
  });
  const publication = useMutation({
    mutationFn: ({
      id,
      revision,
      published,
    }: BlogPublicationMutationVariables) =>
      blogService.setPublication(id, revision, published),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: ({ id, revision }: BlogRemoveMutationVariables) =>
      blogService.delete(id, revision),
    onSuccess: refresh,
  });
  return {
    save,
    publication,
    remove,
    isPending: save.isPending || publication.isPending || remove.isPending,
  };

}
