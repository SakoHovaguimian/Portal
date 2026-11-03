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

  // **************************************
  // MARK: - LIST USERS
  // **************************************

  async listUsers(query: UsersQuery, signal?: AbortSignal) {

    const params = new URLSearchParams({
      query: query.query || '',
      limit: String(query.limit),
      offset: String(query.offset),
    });
    const page = await this.api.request<PaginatedResult<UserTransport>>(
      `/users?${params}`,
      { signal },
    );
    const users = page.data.map(mapUserTransportToDomain);

    return { ...page, data: users };

  }

  // **************************************
  // MARK: - GET USER BY ID
  // **************************************

  async getUserById(id: string, signal?: AbortSignal) {

    return mapUserTransportToDomain(
      await this.api.request<UserTransport>(
        `/users/${encodeURIComponent(id)}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - UPDATE CURRENT USER
  // **************************************

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
