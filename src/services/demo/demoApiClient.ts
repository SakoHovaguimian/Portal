import 'server-only';
import { z } from 'zod';
import { UserMutationInputSchema } from '@/models/user';
import { FeatureRequestMutationInputSchema } from '@/models/featureRequest';
import {
  AuthError,
  NotFoundError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import { strings } from '@/strings';
import { ChatMessageInputSchema } from '@/modules/chat/models/chatMessage';
import type { ServerSession } from '@/services/session/models/serverSession';
import { getDemoState } from './demoState';
import { dashboardModelMeta } from './demoFixtures';
import { DemoPageQuerySchema } from './models/demoPageQuery';
import { getDemoContext } from './demoRuntime';
import { simulateDemoRequest } from './demoSimulation';
import type { DemoRequestHandler } from './models/demoRequestHandler';
import { handleDemoOnboardingRequest } from '@/modules/onboarding/demo/handleDemoOnboardingRequest';
import { mapUserMutationToTransport } from '../api/domainMappers';
import { portalModules } from '@/config/portalModules';

export class DemoApiClient {

  constructor(private readonly handlers: DemoRequestHandler[] = []) {}

  // **************************************
  // MARK: - REGISTER DEMO REQUEST HANDLER
  // **************************************

  register(handler: DemoRequestHandler) {
    this.handlers.push(handler);
  }

  // **************************************
  // MARK: - HANDLE DEMO API REQUEST
  // **************************************

  async proxy(
    request: Request,
    path: string,
    session: ServerSession,
  ): Promise<Response> {

    const state = getDemoState();
    const current = state.users.find((user) => user.id === session.user.id);
    if (!current || current.disabled || current.deleted) { throw new AuthError(strings.errors.sessionExpired); }
    const url = new URL(path, 'http://portal.internal');
    const parts = url.pathname
      .split('/')
      .filter(Boolean)
      .map(decodeURIComponent);
    const [resource, id] = parts;
    const method = request.method;
    const context = await getDemoContext();
    if (resource !== 'onboarding') { await simulateDemoRequest(context, request.signal); }
    const empty = context.scenario === 'empty' && method === 'GET';

    // **************************************
    // MARK: - CREATE DEMO JSON RESPONSE
    // **************************************

    const json = (body: unknown, status = 200) =>
      Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

    // **************************************
    // MARK: - READ DEMO REQUEST INPUT
    // **************************************

    const input = async () => {

      const inputPromise = request
        .json()
        .then((value) => z.record(z.string(), z.unknown()).parse(value))
        .catch(() => {
          throw new ValidationError(strings.errors.invalidInput);
        });

      return inputPromise;

    };

    // **************************************
    // MARK: - CREATE DEMO RESULT PAGE
    // **************************************

    const page = <T>(allRows: T[]) => {

      const rows = empty ? [] : allRows;
      const { limit, offset } = DemoPageQuerySchema.parse(
        Object.fromEntries(url.searchParams),
      );
      return {
        data: rows.slice(offset, offset + limit),
        total: rows.length,
        limit,
        offset,
      };

    };
    for (const handler of [handleDemoOnboardingRequest, ...this.handlers]) {

      const response = await handler({
        request,
        path,
        url,
        parts,
        session,
        current,
        state,
        json,
        input,
        page,
        empty,
      });
      if (response) { return response; }

    }
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
    if (resource === 'users') {

      if (method === 'GET' && !id) {

        const usersResponse = json(
          page(
            state.users.filter((user) => {

              const matchesSearch = [user.first_name, user.last_name, user.email].some((value) =>
                value.toLowerCase().includes(search),
              );

              return matchesSearch;

            },
            ),
          ),
        );

        return usersResponse;

      }
      const user =
        id === 'profile' ? current : state.users.find((user) => user.id === id);
      if (!user) { throw new NotFoundError(); }
      if (method === 'GET' && parts.length === 2) { return json(user); }
      if (method === 'PUT' && id !== 'profile') {

        if (user.id !== current.id) { throw new OwnershipError(); }
        const raw = await input();
        const validated = UserMutationInputSchema.parse({
          firstName: raw.first_name,
          lastName: raw.last_name,
          email: raw.email,
          phoneNumber: raw.phone_number,
          dateOfBirth: raw.date_of_birth,
        });
        if (validated.email !== current.email) { throw new ValidationError(strings.errors.invalidInput); }
        Object.assign(user, mapUserMutationToTransport(validated), {
          updated_at: new Date().toISOString(),
        });
        return json(user);

      }

    }
    if (resource === 'feature-requests') {

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

    }
    if (resource === 'dashboard' && method === 'GET') {

      const models = [
        {
          key: 'user',
          display_name: strings.ui.demoApiClient.users,
          field_count: 10,
          record_count: empty ? 0 : state.users.length,
        },
        {
          key: 'featureRequest',
          display_name: strings.ui.demoApiClient.featureRequests,
          field_count: 7,
          record_count: empty ? 0 : visibleRequests.length,
        },
      ].filter((model) => model.key === 'user' ? portalModules.users : portalModules.featureRequests);
      if (id === 'overview') {

        const overviewResponse = json({
          models: models.map((model) => {

            const modelOverview = ({
              model: model.key,
              display_name: model.display_name,
              total_count: model.record_count,
              period_count: empty
                ? 0
                : (model.key === 'user' ? state.users : visibleRequests).filter(
                  (item) =>
                    Date.parse(item.created_at) >= Date.now() - 30 * 86400000,
                ).length,
              growth_percent: null,
            });

            return modelOverview;

          }),
          date_range: {
            from: new Date(Date.now() - 30 * 86400000).toISOString(),
            to: new Date().toISOString(),
          },
        });

        return overviewResponse;

      }
      if (id === 'models' && !parts[2]) { return json({ models }); }
      if (id === 'models') {

        const meta = dashboardModelMeta[parts[2]];
        if (!meta || !models.some((model) => model.key === parts[2])) { throw new NotFoundError(); }
        return json({
          ...meta,
          total_records: empty
            ? 0
            : parts[2] === 'user'
              ? state.users.length
              : visibleRequests.length,
        });

      }
      if (id === 'records') {

        const model = url.searchParams.get('model');
        if ((model !== 'user' && model !== 'featureRequest') || !models.some((item) => item.key === model)) { throw new NotFoundError(); }
        const rows = model === 'user' ? state.users : visibleRequests;
        const recordsResponse = json(
          page(
            rows.filter((item) =>
              JSON.stringify(item).toLowerCase().includes(search),
            ),
          ),
        );

        return recordsResponse;

      }

    }
    if (resource === 'chat' && id === 'messages') {

      if (method === 'GET') { return json(empty ? [] : state.messages.slice(-100)); }
      if (method === 'POST') {

        const body = ChatMessageInputSchema.parse(await input());
        const message = {
          id: crypto.randomUUID(),
          userId: current.id,
          author: `${current.first_name} ${current.last_name}`,
          message: body.message,
          createdAt: new Date().toISOString(),
        };
        state.messages.push(message);
        return json(message, 201);

      }

    }
    throw new NotFoundError();

  }

}
