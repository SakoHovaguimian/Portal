import { PaginatedResultSchema } from '@/models/paginatedResult';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { validateInput } from '@/utils/validateInput';

import { __Name__InputSchema, __Name__RecordSchema, type __Name__Input } from '../models/__key__Record';
import { __key__ApiPath } from '../__key__ApiPath';

const pageSchema = PaginatedResultSchema(__Name__RecordSchema);

export class __Name__Service {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - LIST __MARK__
  // **************************************

  async list(query: string, offset: number, signal?: AbortSignal) {

    const params = new URLSearchParams({ query, offset: String(offset), limit: '25' });
    const page = await this.api.request<unknown>(`${__key__ApiPath}?${params}`, { signal });
    return pageSchema.parse(page);

  }

  // **************************************
  // MARK: - GET RECORD
  // **************************************

  async get(id: string, signal?: AbortSignal) {

    const record = await this.api.request<unknown>(`${__key__ApiPath}/${encodeURIComponent(id)}`, { signal });
    return __Name__RecordSchema.parse(record);

  }

  // **************************************
  // MARK: - CREATE RECORD
  // **************************************

  async create(input: __Name__Input) {

    const record = await this.api.request<unknown>(__key__ApiPath, {
      method: 'POST', body: validateInput(__Name__InputSchema, input),
    });
    return __Name__RecordSchema.parse(record);

  }

  // **************************************
  // MARK: - UPDATE RECORD
  // **************************************

  async update(id: string, input: __Name__Input) {

    const record = await this.api.request<unknown>(`${__key__ApiPath}/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: validateInput(__Name__InputSchema, input),
    });
    return __Name__RecordSchema.parse(record);

  }

}
