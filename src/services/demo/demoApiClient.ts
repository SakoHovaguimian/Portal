import 'server-only';
import { z } from 'zod';

import { getProjectRouting } from '@/config/getProjectRouting';
import {
  AuthError,
  NotFoundError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import { UserMutationInputSchema } from '@/models/user';
import type { ServerSession } from '@/services/session/models/serverSession';
import { strings } from '@/strings';

import { mapUserMutationToTransport } from '../api/domainMappers';
import { getDemoContext } from './demoRuntime';
import { simulateDemoRequest } from './demoSimulation';
import { getDemoState } from './demoState';
import { DemoPageQuerySchema } from './models/demoPageQuery';
import type { DemoRequestHandler } from './models/demoRequestHandler';

export class DemoApiClient {

  constructor(private readonly handlers: readonly DemoRequestHandler[]) {}

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
    const routing = getProjectRouting();
    for (const handler of this.handlers) {

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
        routing,
      });
      if (response) { return response; }

    }
    if (resource === 'users') {

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
    throw new NotFoundError();

  }

}
