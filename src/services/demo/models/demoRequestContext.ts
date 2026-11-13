import type { ProjectRouting } from '@/config/models/projectRouting';
import type { PaginatedResult } from '@/models/paginatedResult';
import type { ServerSession } from '@/services/session/models/serverSession';

import type { DemoState } from './demoState';
import type { DemoUser } from './demoUser';

export interface DemoRequestContext {

  request: Request;
  path: string;
  url: URL;
  parts: string[];
  session: ServerSession;
  current: DemoUser;
  state: DemoState;
  empty: boolean;
  routing: ProjectRouting;

  input(): Promise<Record<string, unknown>>;

  json(body: unknown, status?: number): Response;
  page<T>(rows: T[]): PaginatedResult<T>;

}
