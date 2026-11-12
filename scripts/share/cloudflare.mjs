import { spawnSync } from 'node:child_process';
import { devNull } from 'node:os';

// **************************************
// MARK: - CREATE CLOUDFLARE ENVIRONMENT
// **************************************

export function createCloudflareEnvironment() {

  // Quick Tunnels must not inherit an existing named tunnel or its token.
  const cloudflareEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(([variableName]) => !variableName.startsWith('TUNNEL_')),
  );

  return cloudflareEnvironment;

}

// **************************************
// MARK: - REQUIRE CLOUDFLARED EXECUTABLE
// **************************************

export function requireCloudflaredExecutable(cloudflareEnvironment) {

  const cloudflaredExecutable = cloudflareEnvironment.CLOUDFLARED_PATH || 'cloudflared';
  const versionCheckResult = spawnSync(cloudflaredExecutable, ['--version'], {
    env: cloudflareEnvironment,
    stdio: 'ignore',
    timeout: 5000,
  });

  if (versionCheckResult.error || versionCheckResult.status !== 0) {
    throw new Error('installHint');
  }

  return cloudflaredExecutable;

}

// **************************************
// MARK: - BUILD TUNNEL ARGUMENTS
// **************************************

function buildTunnelArguments(cloudflareEnvironment, localPort) {

  const tunnelArguments = [
    'tunnel',
    '--config', devNull,
    '--no-autoupdate',
    '--url', `http://127.0.0.1:${localPort}`,
    '--protocol', 'http2',
  ];
  const allowedEmails = cloudflareEnvironment.SHARE_ALLOWED_EMAILS?.trim();

  if (allowedEmails) {
    tunnelArguments.push('--allowed-mail', allowedEmails);
  }

  return tunnelArguments;

}

// **************************************
// MARK: - OBSERVE TUNNEL CONNECTION
// **************************************

function observeTunnelConnection(tunnelProcess) {

  const tunnelConnection = { outputBuffer: '', publicUrl: undefined, isConnected: false };
  const handleTunnelOutput = (outputChunk) => {

    tunnelConnection.outputBuffer = (tunnelConnection.outputBuffer + outputChunk.toString()).slice(-32_000);
    tunnelConnection.publicUrl ||= tunnelConnection.outputBuffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com\b/)?.[0];
    tunnelConnection.isConnected ||= tunnelConnection.outputBuffer.includes('Registered tunnel connection');

  };

  tunnelProcess.stdout.on('data', handleTunnelOutput);
  tunnelProcess.stderr.on('data', handleTunnelOutput);

  return tunnelConnection;

}

// **************************************
// MARK: - START TUNNEL
// **************************************

export async function startTunnel(shareProcesses, cloudflaredExecutable, cloudflareEnvironment, localPort) {

  const tunnelArguments = buildTunnelArguments(cloudflareEnvironment, localPort);
  const tunnelProcess = shareProcesses.startProcess(
    'cloudflared',
    cloudflaredExecutable,
    tunnelArguments,
    cloudflareEnvironment,
    true,
  );
  const tunnelConnection = observeTunnelConnection(tunnelProcess);

  await shareProcesses.waitUntilReady(
    () => tunnelConnection.publicUrl && tunnelConnection.isConnected,
    90_000,
    'tunnelHint',
  );

  return tunnelConnection.publicUrl;

}
