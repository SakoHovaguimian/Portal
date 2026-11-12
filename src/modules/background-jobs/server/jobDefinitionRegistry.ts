import 'server-only';

import { portalJobStrings as copy } from '@/strings';

import type { BackgroundJobDefinition } from '../models/backgroundJobDefinition';

const registry = globalThis as typeof globalThis & {
  portalBackgroundJobDefinitions?: Map<string, BackgroundJobDefinition>;
};

// **************************************
// MARK: - GET JOB DEFINITIONS
// **************************************

function getJobDefinitions() {

  registry.portalBackgroundJobDefinitions ??= new Map();
  return registry.portalBackgroundJobDefinitions;

}

// **************************************
// MARK: - REGISTER BACKGROUND JOB DEFINITION
// **************************************

/** Register trusted code at server composition time, never from request input. */
export function registerBackgroundJobDefinition<Input>(definition: BackgroundJobDefinition<Input>) {

  if (getJobDefinitions().has(definition.type)) { throw new Error(copy.errors.duplicateDefinition); }
  if (!Number.isInteger(definition.maxAttempts) || definition.maxAttempts < 1 || definition.maxAttempts > 10) { throw new Error(copy.errors.invalidInput); }
  getJobDefinitions().set(definition.type, {
    ...definition,
    run: (input, context) => definition.run(definition.inputSchema.parse(input), context),
  });

}

// **************************************
// MARK: - GET BACKGROUND JOB DEFINITION
// **************************************

export function getBackgroundJobDefinition(type: string) {
  return getJobDefinitions().get(type);
}
