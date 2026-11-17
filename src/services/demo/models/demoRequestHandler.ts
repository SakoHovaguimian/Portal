import type { DemoRequestContext } from './demoRequestContext';

export type { DemoRequestContext } from './demoRequestContext';

export type DemoRequestHandler = (
  context: DemoRequestContext,
) => Promise<Response | null>;
