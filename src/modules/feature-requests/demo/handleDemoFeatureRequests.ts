import 'server-only';

import { NotFoundError } from '@/errors/domainErrors';
import { FeatureRequestMutationInputSchema } from '@/models/featureRequest';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';

// **************************************
// MARK: - HANDLE DEMO FEATURE REQUESTS
// **************************************

export const handleDemoFeatureRequests: DemoRequestHandler = async ({
  request,
  parts,
  url,
  state,
  current,
  input,
  json,
  page,
}) => {

  const [resource, id] = parts;
  if (resource !== 'feature-requests') { return null; }
  const method = request.method;
  const search = (
    url.searchParams.get('query') ||
    url.searchParams.get('search') ||
    ''
  )
    .trim()
    .toLowerCase();
  const visibleRequests = state.featureRequests.filter(
    (item) => !item.deleted && item.user_id === current.id,
  );
  if (method === 'GET' && !id) {

    const requestsResponse = json(
      page(
        visibleRequests
          .filter((item) => item.message.toLowerCase().includes(search))
          .map((item) => ({ ...item, user: current })),
      ),
    );

    return requestsResponse;

  }
  if (method === 'POST' && !id) {

    const body = FeatureRequestMutationInputSchema.parse(await input());
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      user_id: current.id,
      message: body.message,
      created_at: now,
      updated_at: now,
      deleted: false,
      user: current,
    };
    state.featureRequests.unshift(item);
    return json(item, 201);

  }
  const item = visibleRequests.find((item) => item.id === id);
  if (!item) { throw new NotFoundError(); }
  if (method === 'GET') { return json({ ...item, user: current }); }
  if (method === 'PATCH') {

    item.message = FeatureRequestMutationInputSchema.parse(
      await input(),
    ).message;
    item.updated_at = new Date().toISOString();
    return json(item);

  }
  if (method === 'DELETE') {

    item.deleted = true;
    return new Response(null, { status: 204 });

  }

  return null;

};
