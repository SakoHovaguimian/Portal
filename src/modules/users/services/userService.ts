import { validateInput } from '@/utils/validateInput';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { UserMutationInputSchema, type UserMutationInput } from '@/models/user';
import type { UsersQuery, PaginatedResult } from '@/models/query';
import type { UserTransport } from '@/services/api/models';
import {
  mapUserMutationToTransport,
  mapUserTransportToDomain,
} from '@/services/api/domainMappers';
export class UserService {
  constructor(private readonly api: ApiClientInterface) {}
  async listUsers(query: UsersQuery) {
    const params = new URLSearchParams({
      query: query.query || '',
      limit: String(query.limit),
      offset: String(query.offset),
    });
    const page = await this.api.request<PaginatedResult<UserTransport>>(
      `/users?${params}`,
    );
    return { ...page, data: page.data.map(mapUserTransportToDomain) };
  }
  async getUserById(id: string) {
    return mapUserTransportToDomain(
      await this.api.request<UserTransport>(`/users/${encodeURIComponent(id)}`),
    );
  }
  async updateCurrentUser(id: string, input: UserMutationInput) {
    return mapUserTransportToDomain(
      await this.api.request<UserTransport>(
        `/users/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: mapUserMutationToTransport(
            validateInput(UserMutationInputSchema, input),
          ),
        },
      ),
    );
  }
}
