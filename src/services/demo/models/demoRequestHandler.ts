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
  json(body: unknown, status?: number): Response;
  input(): Promise<Record<string, unknown>>;
  page<T>(rows: T[]): {
    data: T[];
    total: number;
    limit: number;
    offset: number;
  };
}
export type DemoRequestHandler = (
  context: DemoRequestContext,
) => Promise<Response | null>;
