import { createRequire } from 'node:module';
import { createServer } from 'node:net';

const require = createRequire(import.meta.url);

// **************************************
// MARK: - ASSERT PORT AVAILABLE
// **************************************

export async function assertPortAvailable(localPort) {

  const portAvailabilityPromise = new Promise((resolve, reject) => {

    const portProbeServer = createServer();

    portProbeServer.once('error', () => {
      reject(new Error('portHint', { cause: { port: localPort } }));
    });

    portProbeServer.listen(localPort, '127.0.0.1', () => portProbeServer.close(resolve));

  });

  await portAvailabilityPromise;

}

// **************************************
// MARK: - START DEVELOPMENT SERVER
// **************************************

export function startDevelopmentServer(shareProcesses, localPort, publicTunnelUrl, inheritedEnvironment) {

  // Set the origin before Next starts; never rewrite the developer's env files.
  const developmentEnvironment = {
    ...inheritedEnvironment,
    NODE_ENV: 'development',
    PORTAL_APP_ORIGIN: publicTunnelUrl,
    PORTAL_SHARE_ORIGIN: publicTunnelUrl,
  };
  const nextExecutablePath = require.resolve('next/dist/bin/next');
  const developmentServerArguments = [
    nextExecutablePath,
    'dev',
    '--hostname', '127.0.0.1',
    '--port', String(localPort),
  ];

  shareProcesses.startProcess(
    'Portal',
    process.execPath,
    developmentServerArguments,
    developmentEnvironment,
  );

}

// **************************************
// MARK: - WAIT FOR DEVELOPMENT SERVER
// **************************************

export async function waitForDevelopmentServer(shareProcesses, localPort) {

  const readinessUrl = `http://127.0.0.1:${localPort}`;

  await shareProcesses.waitUntilReady(
    () => isDevelopmentServerReady(shareProcesses, readinessUrl),
    120_000,
    'serverHint',
  );

}

// **************************************
// MARK: - CHECK DEVELOPMENT SERVER READINESS
// **************************************

async function isDevelopmentServerReady(shareProcesses, readinessUrl) {

  try {

    const requestSignal = AbortSignal.any([
      shareProcesses.shutdownSignal,
      AbortSignal.timeout(2000),
    ]);
    const readinessResponse = await fetch(readinessUrl, { signal: requestSignal, redirect: 'manual' });

    await readinessResponse.body?.cancel();
    return readinessResponse.status >= 200 && readinessResponse.status < 400;

  } catch {
    return false;
  }

}
