import { __key__ApiPath } from './__key__ApiPath';

export const __key__QueryKeys = {
  lists: (owner: string | undefined) => [__key__ApiPath, owner, 'list'] as const,
  list: (owner: string | undefined, query: string, offset: number) => [__key__ApiPath, owner, 'list', query, offset] as const,
  detail: (owner: string | undefined, id: string) => [__key__ApiPath, owner, 'detail', id] as const,
};
