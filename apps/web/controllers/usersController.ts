import { UsersQuerySchema, type ServiceContainer } from '@semantic-web/core';

export async function getUsersPageData(
  container: ServiceContainer,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const query = UsersQuerySchema.parse({
    query: typeof searchParams?.query === 'string' ? searchParams.query : undefined,
    limit: 25,
    offset: 0,
  });

  return container.services.userService.listUsers(query);
}

export async function getUserDetailPageData(container: ServiceContainer, userId: string) {
  return container.services.userService.getUserById(userId);
}

export async function getProfilePageData(container: ServiceContainer) {
  const session = await container.services.authService.assertAuthenticated();
  return container.services.userService.getUserById(session.user.id);
}
