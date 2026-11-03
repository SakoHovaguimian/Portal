import 'server-only';
import type { BackgroundJobDefinition } from '../models/backgroundJobDefinition';
import { portalJobStrings as copy } from '@/strings';

const registry = globalThis as typeof globalThis & {
  portalBackgroundJobDefinitions?: Map<string, BackgroundJobDefinition>;
};

// **************************************
// MARK: - GET JOB DEFINITIONS
// **************************************

function definitions() {

  registry.portalBackgroundJobDefinitions ??= new Map();
  return registry.portalBackgroundJobDefinitions;

}

// **************************************
// MARK: - REGISTER BACKGROUND JOB DEFINITION
// **************************************

/** Register trusted code at server composition time, never from request input. */
export function registerBackgroundJobDefinition<Input>(definition: BackgroundJobDefinition<Input>) {

  if (definitions().has(definition.type)) { throw new Error(copy.errors.duplicateDefinition); }
  if (!Number.isInteger(definition.maxAttempts) || definition.maxAttempts < 1 || definition.maxAttempts > 10) { throw new Error(copy.errors.invalidInput); }
  definitions().set(definition.type, {
    ...definition,
    run: (input, context) => definition.run(definition.inputSchema.parse(input), context),
  });

}

// **************************************
// MARK: - GET BACKGROUND JOB DEFINITION
// **************************************

export function getBackgroundJobDefinition(type: string) {
  return definitions().get(type);
}
