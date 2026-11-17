export interface BackendRouteContext {
  params: Promise<{ path: string[] }>;
}
