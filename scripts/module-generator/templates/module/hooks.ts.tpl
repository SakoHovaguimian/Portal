'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceContainer, useSessionState } from '@/providers/AppProviders';

import type { __Name__Input } from './models/__key__Record';
import { __key__QueryKeys } from './__key__QueryKeys';

export function use__Name__List(query: string, offset: number) {

  const { __key__Service } = useServiceContainer();
  const owner = useSessionState().session?.user.id;
  const records = useQuery({
    queryKey: __key__QueryKeys.list(owner, query, offset),
    queryFn: ({ signal }) => __key__Service.list(query, offset, signal),
    enabled: Boolean(owner),
    staleTime: 30_000,
  });

  return records;

}

export function use__Name__Record(id: string) {

  const { __key__Service } = useServiceContainer();
  const owner = useSessionState().session?.user.id;
  const record = useQuery({
    queryKey: __key__QueryKeys.detail(owner, id),
    queryFn: ({ signal }) => __key__Service.get(id, signal),
    enabled: Boolean(owner && id),
    staleTime: 30_000,
  });

  return record;

}

export function useSave__Name__Record(id?: string) {

  const { __key__Service } = useServiceContainer();
  const owner = useSessionState().session?.user.id;
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: (input: __Name__Input) => id ? __key__Service.update(id, input) : __key__Service.create(input),
    onSuccess: async (record) => {

      const detail = __key__QueryKeys.detail(owner, record.id);
      await client.cancelQueries({ queryKey: detail, exact: true });
      client.setQueryData(detail, record);
      void client.invalidateQueries({ queryKey: __key__QueryKeys.lists(owner) });

    },
  });

  return save;

}
