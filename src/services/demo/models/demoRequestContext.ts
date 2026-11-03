import type { ServerSession } from '@/services/session/models/serverSession';
import type { DemoState } from './demoState';
import type { DemoUser } from './demoUser';
import type { PaginatedResult } from '@/models/paginatedResult';

export interface DemoRequestContext {

  request: Request;
  path: string;
  url: URL;
  parts: string[];
  session: ServerSession;
  current: DemoUser;
  state: DemoState;
  empty: boolean;

  input(): Promise<Record<string, unknown>>;

  json(body: unknown, status?: number): Response;
  page<T>(rows: T[]): PaginatedResult<T>;

}
