import { parseArgs } from 'node:util';

// **************************************
// MARK: - PARSE SHARE OPTIONS
// **************************************

export function parseShareOptions() {

  try {

    const parsedArguments = parseArgs({
      options: {
        help: { type: 'boolean' },
        port: { type: 'string' },
      },
    });

    return parsedArguments.values;

  } catch {
    throw new Error('optionsHint');
  }

}

// **************************************
// MARK: - RESOLVE LOCAL PORT
// **************************************

export function resolveLocalPort(shareOptions) {

  const configuredPort = shareOptions.port ?? (process.env.SHARE_PORT?.trim() || '3001');
  const isValidPort = /^[1-9]\d*$/.test(configuredPort) && Number(configuredPort) <= 65535;

  if (!isValidPort) {
    throw new Error('invalidPortHint');
  }

  return Number(configuredPort);

}
