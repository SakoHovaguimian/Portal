import type { MediaActor } from './mediaActor';
export interface MediaRequestOptions {
  request: Request;
  path: string;
  actor: MediaActor | null;
  demoMode: boolean;
  forward?: (request: Request, path: string) => Promise<Response>;
}
