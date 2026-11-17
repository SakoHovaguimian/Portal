import 'server-only';

import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';

// **************************************
// MARK: - HANDLE DEMO USER DIRECTORY
// **************************************

export const handleDemoUserDirectory: DemoRequestHandler = async ({
  request,
  parts,
  url,
  state,
  json,
  page,
}) => {

  const [resource, id] = parts;
  if (resource !== 'users' || id || request.method !== 'GET') { return null; }
  const search = (
    url.searchParams.get('query') ||
    url.searchParams.get('search') ||
    ''
  )
    .trim()
    .toLowerCase();
  const usersResponse = json(
    page(
      state.users.filter((user) => {

        const matchesSearch = [user.first_name, user.last_name, user.email].some((value) =>
          value.toLowerCase().includes(search),
        );

        return matchesSearch;

      }),
    ),
  );

  return usersResponse;

};
